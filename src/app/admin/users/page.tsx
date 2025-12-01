'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getAllUsers, updateUserRole, deleteUser, getUserHistory, UserData } from '@/app/actions/user';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
    Search, ArrowLeft, Shield, User, Wrench, Loader2,
    Trash2, History, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminUsersPage() {
    const { user: currentUser } = useAuthStore();
    const router = useRouter();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Delete State
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // History State
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [selectedUserHistory, setSelectedUserHistory] = useState<any[]>([]);
    const [selectedUserName, setSelectedUserName] = useState('');

    useEffect(() => {
        // Protect route
        if (currentUser && currentUser.role !== 'admin') {
            router.push('/profile');
            return;
        }

        fetchUsers();
    }, [currentUser, router]);

    const fetchUsers = async () => {
        setLoading(true);
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.users);
        } else {
            toast.error('ไม่สามารถดึงข้อมูลสมาชิกได้');
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            const result = await updateUserRole(userId, newRole);
            if (result.success) {
                toast.success('อัปเดตบทบาทสำเร็จ');
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } else {
                toast.error('เกิดข้อผิดพลาดในการอัปเดต');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const result = await deleteUser(deleteId);
            if (result.success) {
                toast.success('ลบสมาชิกสำเร็จ');
                setUsers(users.filter(u => u.id !== deleteId));
            } else {
                toast.error('ไม่สามารถลบสมาชิกได้ (อาจมีข้อมูลเชื่อมโยง)');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการลบ');
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    const handleViewHistory = async (user: UserData) => {
        setSelectedUserName(user.name);
        setHistoryOpen(true);
        setHistoryLoading(true);
        try {
            const result = await getUserHistory(user.id);
            if (result.success) {
                setSelectedUserHistory(result.history);
            } else {
                toast.error('ไม่สามารถดึงประวัติได้');
            }
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการดึงประวัติ');
        } finally {
            setHistoryLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Admin</Badge>;
            case 'technician':
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">Technician</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200">User</Badge>;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
            case 'cleared':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'in_progress':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'cancelled':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <header className="bg-white border-b sticky top-0 z-10 px-4 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-xl font-bold flex-1">จัดการสมาชิก</h1>
                    <div className="text-sm text-muted-foreground">
                        ทั้งหมด {users.length} คน
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-4">
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        placeholder="ค้นหาชื่อ หรือ อีเมล..."
                        className="pl-10 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {filteredUsers.map((user) => (
                        <Card key={user.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-semibold truncate">{user.name}</h3>
                                    {getRoleBadge(user.role)}
                                </div>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    สมัครเมื่อ: {user.created_at ? new Date(user.created_at).toLocaleDateString('th-TH') : '-'}
                                </p>
                            </div>

                            <div className="w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 mt-2 sm:mt-0 flex flex-wrap items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewHistory(user)}
                                    className="flex-1 sm:flex-none"
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    ประวัติ
                                </Button>

                                <Select
                                    value={user.role}
                                    onValueChange={(val) => handleRoleChange(user.id, val)}
                                    disabled={updatingId === user.id || user.id === currentUser?.id}
                                >
                                    <SelectTrigger className="w-[130px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="general_user">User</SelectItem>
                                        <SelectItem value="technician">Technician</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => setDeleteId(user.id)}
                                    disabled={user.id === currentUser?.id}
                                    className="shrink-0"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            ไม่พบรายชื่อสมาชิกที่ค้นหา
                        </div>
                    )}
                </div>
            </main>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ยืนยันการลบสมาชิก?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลของสมาชิกคนนี้จะถูกลบออกจากระบบ
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>ยกเลิก</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'กำลังลบ...' : 'ยืนยันลบ'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* History Dialog */}
            <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
                <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>ประวัติกิจกรรม: {selectedUserName}</DialogTitle>
                    </DialogHeader>

                    <ScrollArea className="flex-1 pr-4">
                        {historyLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : selectedUserHistory.length > 0 ? (
                            <div className="space-y-3 py-2">
                                {selectedUserHistory.map((item, index) => (
                                    <div key={index} className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-sm text-gray-900">{item.title}</span>
                                            <Badge variant="outline" className={`text-xs capitalize ${getStatusColor(item.status)}`}>
                                                {item.status}
                                            </Badge>
                                        </div>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{new Date(item.created_at).toLocaleDateString('th-TH', {
                                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
                                <AlertTriangle className="w-10 h-10 text-gray-300" />
                                <p>ไม่พบประวัติกิจกรรม</p>
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
