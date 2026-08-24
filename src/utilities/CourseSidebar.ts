import { TopicModel } from "../types/models/Topic.model";

export type SidebarProblem = {
	problemId: string;
	title: string;
	difficulty: number;
	isPassed: boolean;
};

export type SidebarCollection = {
	collectionId: string;
	name: string;
	problems: SidebarProblem[];
	solvedCount: number;
};

export type FlatSidebarProblem = SidebarProblem & {
	collectionId: string;
	collectionName: string;
};

const byOrder = (a: { order: number }, b: { order: number }) =>
	(a.order ?? 0) - (b.order ?? 0);

/**
 * Normalises the deeply nested TopicModel the backend returns into a flat shape
 * the sidebar can render, sorted by the `order` field the API provides on both
 * topic-collections and collection-problems.
 */
export const toSidebarCollections = (
	course?: TopicModel
): SidebarCollection[] => {
	if (!course?.collections) return [];

	return [...course.collections]
		.filter((topicCollection) => Boolean(topicCollection.collection))
		.sort(byOrder)
		.map((topicCollection) => {
			const problems = [...(topicCollection.collection.problems ?? [])]
				.filter((collectionProblem) => Boolean(collectionProblem.problem))
				.sort(byOrder)
				.map<SidebarProblem>((collectionProblem) => ({
					problemId: collectionProblem.problem.problem_id,
					title: collectionProblem.problem.title,
					difficulty: collectionProblem.problem.difficulty,
					isPassed: Boolean(
						collectionProblem.problem.best_submission?.is_passed
					),
				}));

			return {
				collectionId: topicCollection.collection.collection_id,
				name: topicCollection.collection.name,
				problems,
				solvedCount: problems.filter((problem) => problem.isPassed).length,
			};
		});
};

export const flattenSidebarProblems = (
	collections: SidebarCollection[]
): FlatSidebarProblem[] =>
	collections.flatMap((collection) =>
		collection.problems.map((problem) => ({
			...problem,
			collectionId: collection.collectionId,
			collectionName: collection.name,
		}))
	);

export const getCourseProgress = (collections: SidebarCollection[]) => {
	const problems = collections.flatMap((collection) => collection.problems);
	return {
		total: problems.length,
		solved: problems.filter((problem) => problem.isPassed).length,
	};
};

export const findCollectionIdOfProblem = (
	collections: SidebarCollection[],
	problemId?: string
): string | undefined => {
	if (!problemId) return undefined;
	return collections.find((collection) =>
		collection.problems.some((problem) => problem.problemId === problemId)
	)?.collectionId;
};

const expandedStorageKey = (courseId: string) =>
	`courseSidebar:expandedCollections:${courseId}`;

/**
 * Expanded collections are remembered per course — sharing one list across every
 * course (as the previous sidebar did) leaked one course's state into another.
 */
export const readExpandedCollections = (courseId?: string): string[] => {
	if (!courseId) return [];
	try {
		const stored = localStorage.getItem(expandedStorageKey(courseId));
		const parsed = stored ? JSON.parse(stored) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
};

export const writeExpandedCollections = (
	courseId: string | undefined,
	collectionIds: string[]
) => {
	if (!courseId) return;
	localStorage.setItem(
		expandedStorageKey(courseId),
		JSON.stringify(collectionIds)
	);
};
