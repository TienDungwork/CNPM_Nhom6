import { useState } from 'react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useData } from '../DataContext';
import { Users, Shield, UserX, UserCheck, Plus, Edit2, Trash2, Search, Calendar } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function UserManagement() {
  const { users, addUser, updateUser, deleteUser, updateUserStatus, getUserPlanners } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPlannerDialog, setShowPlannerDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'user' | 'admin',
  });

  const userList = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    updateUserStatus(userId, !currentStatus);
    toast.success(!currentStatus ? 'User activated' : 'User deactivated');
  };

  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }

    if (users.some(u => u.email === formData.email)) {
      toast.error('Email này đã tồn tại!');
      return;
    }

    addUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      isActive: true,
    });

    toast.success('User created successfully!');
    setShowAddDialog(false);
    setFormData({ name: '', email: '', password: '', role: 'user' });
  };

  const handleEditUser = () => {
    if (!selectedUser) return;

    if (!formData.name || !formData.email) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email không hợp lệ!');
      return;
    }

    updateUser(selectedUser.id, {
      name: formData.name,
      email: formData.email,
      role: formData.role,
    });

    toast.success('User updated successfully!');
    setShowEditDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng "${userName}" không?`)) {
      deleteUser(userId);
      toast.success('User deleted successfully!');
    }
  };

  const openEditDialog = (user: any) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowEditDialog(true);
  };

  const openPlannerDialog = (user: any) => {
    setSelectedUser(user);
    setShowPlannerDialog(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-2" style={{ fontSize: '2rem', fontWeight: 600 }}>User Management</h1>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'user' });
            setShowAddDialog(true);
          }}
          className="gradient-primary text-white border-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Total Users</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>{userList.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Active Users</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                {userList.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center">
              <UserX className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gray-600" style={{ fontSize: '0.875rem' }}>Inactive Users</p>
              <p style={{ fontSize: '1.75rem', fontWeight: 600 }}>
                {userList.filter(u => !u.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="p-4 rounded-xl border-0 shadow-md">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="p-6 rounded-xl border-0 shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 style={{ fontWeight: 600 }}>All Users</h3>
          <Badge variant="secondary">{userList.length} users</Badge>
        </div>

        {userList.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((user) => (
                <TableRow key={user.id}>
                  <TableCell style={{ fontWeight: 600 }}>{user.name}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      <Shield className="w-3 h-3 mr-1" />
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600">{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openPlannerDialog(user)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Planner"
                      >
                        <Calendar className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(user)}
                        className="text-gray-600 hover:text-gray-700"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleStatus(user.id, user.isActive)}
                        className={user.isActive ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                        title={user.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                      </Button>
                      {user.role !== 'admin' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="add-name">Name</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="add-email">Email</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="add-password">Password</Label>
              <Input
                id="add-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter password"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="add-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser} className="gradient-primary text-white border-0">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User Info</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleEditUser} className="gradient-primary text-white border-0">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Planner Dialog */}
      <Dialog open={showPlannerDialog} onOpenChange={setShowPlannerDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Planner - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4 max-h-96 overflow-y-auto">
            {selectedUser && (() => {
              const planners = getUserPlanners(selectedUser.id, today);
              return planners.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>No planner data for today</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {planners.map((planner) => (
                    <div key={planner.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ fontWeight: 600 }}>{planner.time}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{planner.type}</span>
                        {planner.completed && (
                          <Badge className="bg-green-100 text-green-700 ml-auto">Completed</Badge>
                        )}
                      </div>
                      <p className="text-gray-700">{planner.description}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
