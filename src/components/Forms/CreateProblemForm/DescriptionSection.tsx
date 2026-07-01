import React, { useEffect, useRef, useState } from "react";
import { CreateProblemRequestForm, DescriptionMode } from "@/types/forms/CreateProblemRequestForm";
import { PlateEditorValueType } from "@/types/PlateEditorValueType";
import DetailPlateEditor from "../../DetailPlateEditor";
import { Label } from "@/components/shadcn/Label";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/Tabs";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
	DialogDescription,
} from "@/components/shadcn/Dialog";
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProblemService } from "@/services/Problem.service";
import MDEditor from "@uiw/react-md-editor";
import { PDFViewer } from "@embedpdf/react-pdf-viewer";

const MAX_PDF_BYTES = 2.5 * 1024 * 1024;

const PdfViewerContainer = ({ src }: { src: string }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [height, setHeight] = useState(500);

	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		const ro = new ResizeObserver((entries) => {
			const h = entries[0]?.contentRect.height;
			if (h > 0) setHeight(h);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div ref={containerRef} style={{ flex: 1, overflow: "hidden", minHeight: "400px" }}>
			<PDFViewer key={src} config={{ src }} style={{ width: "100%", height: `${height}px` }} />
		</div>
	);
};

type UploadState = "idle" | "uploading" | "success" | "error";

const DescriptionSection = ({
	createRequest,
	setCreateRequest,
}: {
	createRequest: CreateProblemRequestForm;
	setCreateRequest: React.Dispatch<React.SetStateAction<CreateProblemRequestForm>>;
}) => {
	const { mode, markdown, plate, pdf, pdfPreviewUrl } = createRequest.description;

	const [pendingMode, setPendingMode] = useState<DescriptionMode | null>(null);
	const [uploadState, setUploadState] = useState<UploadState>(pdf ? "success" : "idle");
	const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [pdfObjectUrl, setPdfObjectUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// displayUrl: use blob URL from fresh upload, fall back to presigned URL from server
	const displayUrl = pdfObjectUrl ?? pdfPreviewUrl ?? null;

	const handleModeChange = (nextMode: DescriptionMode) => {
		if (nextMode === mode) return;
		if (mode === "pdf" && pdf !== null) {
			setPendingMode(nextMode);
		} else {
			applyMode(nextMode);
		}
	};

	const applyMode = (nextMode: DescriptionMode) => {
		setCreateRequest((prev) => ({ ...prev, description: { ...prev.description, mode: nextMode } }));
		if (nextMode !== "pdf") {
			setPdfObjectUrl(null);
		}
		setPendingMode(null);
	};

	const confirmModeChange = () => {
		if (pendingMode) {
			setCreateRequest((prev) => ({ ...prev, description: { ...prev.description, mode: pendingMode, pdf: null, pdfPreviewUrl: null } }));
			setUploadState("idle");
			setUploadedFileName(null);
			setUploadError(null);
			setPdfObjectUrl(null);
			setPendingMode(null);
		}
	};

	const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > MAX_PDF_BYTES) {
			setUploadError("ไฟล์มีขนาดเกิน 2.5 MB กรุณาเลือกไฟล์ใหม่");
			setUploadState("idle");
			return;
		}
		if (!file.name.toLowerCase().endsWith(".pdf")) {
			setUploadError("รองรับเฉพาะไฟล์ .pdf เท่านั้น");
			setUploadState("idle");
			return;
		}

		const objectUrl = URL.createObjectURL(file);
		setUploadError(null);
		setUploadState("uploading");
		setUploadedFileName(file.name);

		try {
			const res = await ProblemService.uploadPdf(file);
			setPdfObjectUrl(objectUrl);
			setCreateRequest((prev) => ({ ...prev, description: { ...prev.description, pdf: res.data.key } }));
			setUploadState("success");
			setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
		} catch (err) {
			URL.revokeObjectURL(objectUrl);
			setUploadState("error");
			setUploadError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการอัปโหลด");
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleRemoveFile = () => {
		if (pdfObjectUrl) URL.revokeObjectURL(pdfObjectUrl);
		setCreateRequest((prev) => ({ ...prev, description: { ...prev.description, pdf: null } }));
		setUploadState("idle");
		setUploadedFileName(null);
		setUploadError(null);
		setPdfObjectUrl(null);
	};

	return (
		<>
			<div className="flex flex-col h-full gap-3">
				<div className="flex items-center justify-between">
					<Label className="text-base font-semibold">Description</Label>
					<Tabs value={mode} onValueChange={(v) => handleModeChange(v as DescriptionMode)}>
						<TabsList>
							<TabsTrigger value="markdown">Markdown</TabsTrigger>
							<TabsTrigger value="plate">Rich Text (Plate.js)</TabsTrigger>
							<TabsTrigger value="pdf">PDF</TabsTrigger>
						</TabsList>
					</Tabs>
				</div>

				{mode === "markdown" && (
					<div className="flex-1 min-h-0" data-color-mode="dark">
						<MDEditor
							value={markdown}
							onChange={(v) =>
								setCreateRequest((prev) => ({
									...prev,
									description: { ...prev.description, markdown: v ?? "" },
								}))
							}
							height="100%"
							style={{ height: "100%" }}
						/>
					</div>
				)}

				{mode === "plate" && (
					<div className="flex-1 border rounded-lg overflow-hidden bg-background shadow min-h-0">
						<DetailPlateEditor
							value={plate as PlateEditorValueType}
							onChange={(v) =>
								setCreateRequest((prev) => ({
									...prev,
									description: { ...prev.description, plate: v },
								}))
							}
						/>
					</div>
				)}

				{mode === "pdf" && (
					<div className="flex-1 flex flex-col border rounded-lg overflow-hidden min-h-0">
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf"
							className="hidden"
							onChange={handleFileSelect}
						/>

						{uploadState === "idle" && (
							<div className="flex-1 flex items-center justify-center">
								<div className="flex flex-col items-center gap-3 text-center">
									<Upload size={40} className="text-muted-foreground" />
									<p className="text-sm text-muted-foreground">รองรับไฟล์ PDF ขนาดไม่เกิน 2.5 MB</p>
									<button
										onClick={() => fileInputRef.current?.click()}
										className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
									>
										เลือกไฟล์ PDF
									</button>
									{uploadError && <p className="text-sm text-destructive">{uploadError}</p>}
								</div>
							</div>
						)}

						{uploadState === "uploading" && (
							<div className="flex-1 flex items-center justify-center">
								<div className="flex flex-col items-center gap-3 text-center">
									<Loader2 size={40} className="animate-spin text-muted-foreground" />
									<p className="text-sm text-muted-foreground">กำลังอัปโหลด {uploadedFileName}...</p>
								</div>
							</div>
						)}

						{uploadState === "success" && (
							<>
								<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 flex-shrink-0">
									<div className="flex items-center gap-2 text-sm">
										<FileText size={16} className="text-green-500" />
										<span className="font-medium">{uploadedFileName ?? "PDF"}</span>
									</div>
									<div className="flex gap-2">
										<button
											onClick={() => fileInputRef.current?.click()}
											className="px-3 py-1 rounded text-xs border hover:bg-muted transition-colors"
										>
											เปลี่ยนไฟล์
										</button>
										<button
											onClick={handleRemoveFile}
											className={cn(
												"px-3 py-1 rounded text-xs flex items-center gap-1",
												"border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
											)}
										>
											<X size={12} />
											ลบ
										</button>
									</div>
								</div>
								{displayUrl && (
									<PdfViewerContainer src={displayUrl} />
								)}
							</>
						)}

						{uploadState === "error" && (
							<div className="flex-1 flex items-center justify-center">
								<div className="flex flex-col items-center gap-3 text-center">
									<X size={40} className="text-destructive" />
									<p className="text-sm text-destructive">{uploadError}</p>
									<button
										onClick={() => {
											setUploadState("idle");
											setUploadError(null);
											setUploadedFileName(null);
										}}
										className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
									>
										ลองอีกครั้ง
									</button>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			<Dialog open={pendingMode !== null} onOpenChange={(open: boolean) => { if (!open) setPendingMode(null); }}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>เปลี่ยน mode การแสดงผล?</DialogTitle>
						<DialogDescription>
							การเปลี่ยน mode จะลบไฟล์ PDF ที่อัปโหลดไว้ออก ต้องการดำเนินการต่อไหม?
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<button
							onClick={() => setPendingMode(null)}
							className="px-4 py-2 rounded-md border text-sm hover:bg-muted transition-colors"
						>
							ยกเลิก
						</button>
						<button
							onClick={confirmModeChange}
							className="px-4 py-2 rounded-md bg-destructive text-destructive-foreground text-sm hover:bg-destructive/90 transition-colors"
						>
							ยืนยัน
						</button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DescriptionSection;
