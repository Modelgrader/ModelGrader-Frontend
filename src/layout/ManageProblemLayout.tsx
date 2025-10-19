import React from 'react'
import { Card } from '@/components/ui/card'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft, List, BarChart3, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ManageProblemLayoutProps {
    children: React.ReactNode;
    isShow?: boolean;
}

const ManageProblemLayout = ({ children, isShow = false }: ManageProblemLayoutProps) => {
    const { problemId } = useParams();
    
    return (
        <div className={cn({'grid gap-4 lg:gap-6 lg:grid-cols-4': isShow})}>
            {/* Main Content */}
            <div className={cn({'lg:col-span-3': isShow})}>
                {children}
            </div>

            {/* Quick Actions Sidebar - Only when isShow is true */}
            {isShow && (
                <div className="lg:col-span-1">
                    <div className="sticky top-24 mr-4">
                        <Card className="p-4">
                            <h3 className="font-semibold text-lg mb-4 text-gray-800">
                                Problem Management
                            </h3>
                            
                            <div className="space-y-2">
                                {/* Back to Problems List */}
                                <Link to="/my/problems">
                                    <Button variant="outline" className="w-full justify-start">
                                        <ArrowLeft size={16} className="mr-2" />
                                        Back to Problems
                                    </Button>
                                </Link>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-3"></div>

                                {/* Quick Actions */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">
                                        Quick Actions
                                    </h4>
                                    
                                    <Link to="/my/problems">
                                        <Button variant="ghost" className="w-full justify-start">
                                            <List size={16} className="mr-2" />
                                            View All Problems
                                        </Button>
                                    </Link>

                                    {problemId && (
                                        <Link to={`/my/problems/${problemId}`}>
                                            <Button variant="ghost" className="w-full justify-start">
                                                <BarChart3 size={16} className="mr-2" />
                                                View Statistics
                                            </Button>
                                        </Link>
                                    )}

                                    {
                                        problemId && (
                                            <Link to={`/my/problems/${problemId}/edit`}>
                                                <Button variant="ghost" className="w-full justify-start">
                                                    <Pencil size={16} className="mr-2" />
                                                    Edit Problem
                                                </Button>
                                            </Link>
                                        )
                                    }
                                </div>

                                {/* Help Section */}
                                <div className="border-t border-gray-200 my-3"></div>
                                <div className="text-xs text-gray-500">
                                    <p className="mb-2">
                                        <strong>Tip:</strong> While managing problems, you can:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 text-xs">
                                        <li>View submission statistics</li>
                                        <li>Manage test cases</li>
                                        <li>Update group permissions</li>
                                        <li>Preview problem changes</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManageProblemLayout