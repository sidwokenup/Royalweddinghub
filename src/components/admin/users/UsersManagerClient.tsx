'use client';

import React, { useState, useTransition } from 'react';
import {
  Users,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Eye,
  KeyRound,
  UserPlus,
  Trash2,
  RefreshCw,
  Search,
  Check,
  X,
  AlertTriangle,
  Lock,
  Mail,
  User,
  Sparkles,
} from 'lucide-react';
import {
  AdminUserView,
  createAdminUserAction,
  updateAdminUserRoleAction,
  resetAdminUserPasswordAction,
  deleteAdminUserAction,
} from '@/app/admin/users/actions';
import { AdminRole } from '@/lib/db/types';

interface UsersManagerClientProps {
  initialUsers: AdminUserView[];
  currentUserId: string;
}

export function UsersManagerClient({
  initialUsers,
  currentUserId,
}: UsersManagerClientProps) {
  const [users, setUsers] = useState<AdminUserView[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AdminRole>('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoleUser, setEditingRoleUser] = useState<AdminUserView | null>(null);
  const [resettingUser, setResettingUser] = useState<AdminUserView | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUserView | null>(null);

  // Add user form state
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('viewer');
  const [formError, setFormError] = useState<string | null>(null);

  // Reset password form state
  const [resetPasswordVal, setResetPasswordVal] = useState('');
  const [resetError, setResetError] = useState<string | null>(null);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Transitions
  const [isPending, startTransition] = useTransition();

  // Helper to generate a secure random password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let res = '';
    for (let i = 0; i < 12; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };

  const handleOpenAddModal = () => {
    setNewFullName('');
    setNewEmail('');
    setNewPassword(generateRandomPassword());
    setNewRole('viewer');
    setFormError(null);
    setIsAddModalOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const res = await createAdminUserAction({
        fullName: newFullName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });

      if (!res.success) {
        setFormError(res.error || 'Failed to create user account.');
        return;
      }

      // Optimistically add to UI list
      const tempUser: AdminUserView = {
        id: `temp-${Date.now()}`,
        email: newEmail.toLowerCase().trim(),
        full_name: newFullName.trim(),
        role: newRole,
        last_login_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isRootOwner: false,
      };

      setUsers((prev) => [tempUser, ...prev]);
      setIsAddModalOpen(false);
    });
  };

  const handleUpdateRole = (targetRole: AdminRole) => {
    if (!editingRoleUser) return;
    const targetUserId = editingRoleUser.id;

    startTransition(async () => {
      const res = await updateAdminUserRoleAction(targetUserId, targetRole);
      if (!res.success) {
        alert(res.error || 'Failed to update user role.');
        return;
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === targetUserId ? { ...u, role: targetRole } : u))
      );
      setEditingRoleUser(null);
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    setResetError(null);

    startTransition(async () => {
      const res = await resetAdminUserPasswordAction(resettingUser.id, resetPasswordVal);
      if (!res.success) {
        setResetError(res.error || 'Failed to reset password.');
        return;
      }

      setResettingUser(null);
      alert(`Password successfully updated for ${resettingUser.email}`);
    });
  };

  const handleDeleteUser = () => {
    if (!deletingUser) return;
    const targetId = deletingUser.id;

    startTransition(async () => {
      const res = await deleteAdminUserAction(targetId);
      if (!res.success) {
        alert(res.error || 'Failed to delete user.');
        return;
      }

      setUsers((prev) => prev.filter((u) => u.id !== targetId));
      setDeletingUser(null);
    });
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      u.full_name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query);
    return matchesRole && matchesSearch;
  });

  const totalUsers = users.length;
  const superAdminCount = users.filter((u) => u.role === 'super_admin').length;
  const editorCount = users.filter((u) => u.role === 'editor').length;
  const viewerCount = users.filter((u) => u.role === 'viewer').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-[#211617] via-[#1A1211] to-[#140F0D] border border-[#D6B56D]/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#D6B56D] mb-1">
            <Users className="w-4 h-4 text-[#D6B56D]" />
            <span>Role-Based Access Management</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#FAF7F2] font-normal tracking-tight">
            Team Accounts & Permissions
          </h2>
          <p className="text-xs text-[#B8ADA3] mt-1 max-w-2xl leading-relaxed">
            Create team members, grant marketing agencies read-only inquiry access, and manage administrative credentials securely.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#521D2B] to-[#73273B] hover:from-[#662335] hover:to-[#852C44] text-[#FAF7F2] border border-[#D6B56D]/40 font-medium text-xs shadow-[0_4px_16px_rgba(82,29,43,0.4)] hover:shadow-[0_6px_20px_rgba(214,181,109,0.2)] transition-all shrink-0 cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#D6B56D]" />
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* Role Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#181310]/80 border border-[#D6B56D]/15 backdrop-blur-md">
          <div className="text-[11px] font-mono text-[#8C8070] uppercase tracking-wider">Total Accounts</div>
          <div className="text-2xl font-serif text-[#FAF7F2] mt-1 font-semibold">{totalUsers}</div>
          <div className="text-[10px] text-[#B8ADA3] mt-0.5">Active across portal</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181310]/80 border border-[#D6B56D]/15 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#D6B56D] uppercase tracking-wider">Super Admins</span>
            <Shield className="w-3.5 h-3.5 text-[#D6B56D]" />
          </div>
          <div className="text-2xl font-serif text-[#FAF7F2] mt-1 font-semibold">{superAdminCount}</div>
          <div className="text-[10px] text-[#8C8070] mt-0.5">Full control & CRM</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181310]/80 border border-blue-900/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-blue-300 uppercase tracking-wider">Editors</span>
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-2xl font-serif text-[#FAF7F2] mt-1 font-semibold">{editorCount}</div>
          <div className="text-[10px] text-[#8C8070] mt-0.5">Content & lead status</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#181310]/80 border border-amber-900/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider">Viewers (Ads)</span>
            <Eye className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-serif text-[#FAF7F2] mt-1 font-semibold">{viewerCount}</div>
          <div className="text-[10px] text-[#8C8070] mt-0.5">Read-only inquiries</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#181310]/80 border border-[#D6B56D]/15">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8070]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/[0.04] border border-[#D6B56D]/20 rounded-xl pl-9 pr-3 py-2 text-xs text-[#FAF7F2] placeholder-[#8C8070] focus:outline-none focus:border-[#D6B56D] font-sans"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'super_admin', 'editor', 'viewer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition-all cursor-pointer whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-[#521D2B] text-[#FAF7F2] border border-[#D6B56D]/40 shadow-xs'
                  : 'bg-white/[0.02] text-[#8C8070] hover:text-[#FAF7F2] hover:bg-white/[0.05] border border-transparent'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-3xl bg-[#140F0D]/90 border border-[#D6B56D]/15 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D6B56D]/15 bg-white/[0.02] text-[10px] font-mono uppercase tracking-wider text-[#8C8070]">
                <th className="py-3.5 px-6">User & Identity</th>
                <th className="py-3.5 px-6">Access Role</th>
                <th className="py-3.5 px-6">Last Active</th>
                <th className="py-3.5 px-6">Created</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#8C8070] font-sans">
                    No team members found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isRoot = Boolean(user.isRootOwner);
                  const isSelf = user.id === currentUserId;

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Name & Email */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0 border ${
                              user.role === 'super_admin'
                                ? 'bg-gradient-to-tr from-[#521D2B] to-[#8C2E46] border-[#D6B56D]/50 text-[#FAF7F2]'
                                : user.role === 'editor'
                                ? 'bg-blue-950/70 border-blue-700/40 text-blue-200'
                                : 'bg-amber-950/70 border-amber-700/40 text-amber-200'
                            }`}
                          >
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-[#FAF7F2] flex items-center gap-2">
                              <span>{user.full_name}</span>
                              {isRoot && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#521D2B]/80 text-[#D6B56D] border border-[#D6B56D]/30">
                                  Primary Root Owner
                                </span>
                              )}
                              {isSelf && !isRoot && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-[#B8ADA3] border border-white/[0.1]">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#8C8070] font-mono mt-0.5">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-6">
                        {user.role === 'super_admin' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-[#521D2B]/40 text-[#D6B56D] border border-[#D6B56D]/40 shadow-xs">
                            <Shield className="w-3 h-3 text-[#D6B56D]" />
                            <span>Super Admin</span>
                          </span>
                        ) : user.role === 'editor' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-blue-950/40 text-blue-300 border border-blue-800/40 shadow-xs">
                            <ShieldCheck className="w-3 h-3 text-blue-400" />
                            <span>Editor</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono uppercase font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/40 shadow-xs">
                            <Eye className="w-3 h-3 text-amber-400" />
                            <span>Viewer (Ads)</span>
                          </span>
                        )}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-6 font-mono text-[11px] text-[#8C8070]">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never logged in'}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-6 font-mono text-[11px] text-[#8C8070]">
                        {new Date(user.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {!isRoot && (
                            <>
                              <button
                                onClick={() => setEditingRoleUser(user)}
                                title="Change Role"
                                className="px-2.5 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#D6B56D]/40 text-[#B8ADA3] hover:text-[#FAF7F2] text-[11px] font-mono transition-colors cursor-pointer"
                              >
                                Change Role
                              </button>

                              <button
                                onClick={() => {
                                  setResettingUser(user);
                                  setResetPasswordVal(generateRandomPassword());
                                  setResetError(null);
                                }}
                                title="Reset Password"
                                className="p-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#D6B56D]/40 text-[#B8ADA3] hover:text-[#FAF7F2] transition-colors cursor-pointer"
                              >
                                <KeyRound className="w-3.5 h-3.5 text-[#D6B56D]" />
                              </button>

                              {!isSelf && (
                                <button
                                  onClick={() => setDeletingUser(user)}
                                  title="Delete User"
                                  className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/50 border border-rose-900/30 hover:border-rose-700/60 text-rose-400 hover:text-rose-200 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}

                          {isRoot && (
                            <span className="text-[10px] font-mono text-[#8C8070] italic">
                              Protected
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explanatory Help Card for Roles */}
      <div className="p-5 rounded-2xl bg-[#181310]/70 border border-[#D6B56D]/15 text-xs text-[#B8ADA3] space-y-2">
        <div className="font-serif text-[#D6B56D] text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#D6B56D]" />
          <span>Understanding Team Roles</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="font-semibold text-[#FAF7F2] mb-1 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#D6B56D]" />
              <span>Super Admin (Full Access)</span>
            </div>
            <div>Full system control: create/delete team accounts, modify business settings, full venue & CRM operations.</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="font-semibold text-[#FAF7F2] mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              <span>Editor (Content & Leads)</span>
            </div>
            <div>Manage venues, services, media, and update lead consultation statuses. Cannot manage users or system settings.</div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <div className="font-semibold text-[#FAF7F2] mb-1 flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>Viewer (Ads & Marketing)</span>
            </div>
            <div>Read-only access to inquiries, contact numbers, and UTM campaign metrics. Cannot edit, status-modify, or delete leads.</div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODAL 1: ADD NEW TEAM MEMBER */}
      {/* ==================================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#181310] border border-[#D6B56D]/30 p-6 sm:p-8 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8C8070] hover:text-[#FAF7F2] hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-[10px] font-mono text-[#D6B56D] uppercase tracking-widest">
                Admin Panel Provisioning
              </span>
              <h3 className="text-xl font-serif text-[#FAF7F2] font-normal mt-0.5">
                Create New Team Member
              </h3>
              <p className="text-xs text-[#8C8070] mt-1">
                Enter user details and assign their access privilege level.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#FAF7F2] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma (Google Ads Team)"
                    className="w-full bg-white/[0.04] border border-[#D6B56D]/20 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D6B56D] font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#FAF7F2] mb-1.5">
                  Login Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="e.g. ads@agencypartner.com"
                    className="w-full bg-white/[0.04] border border-[#D6B56D]/20 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D6B56D] font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-[#FAF7F2]">
                    Initial Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setNewPassword(generateRandomPassword())}
                    className="text-[10px] text-[#D6B56D] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Password</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-[#D6B56D]/20 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#FAF7F2] focus:outline-none focus:border-[#D6B56D] font-mono tracking-wider"
                  />
                </div>
                <p className="text-[10px] text-[#8C8070] mt-1 font-mono">
                  Make sure to note down or copy this password to give to the user.
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#FAF7F2] mb-2">
                  Select Permission Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewRole('viewer')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newRole === 'viewer'
                        ? 'bg-amber-950/40 border-amber-600/70 text-amber-200'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#8C8070] hover:text-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Viewer</span>
                      {newRole === 'viewer' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[10px] mt-1 text-[#8C8070] leading-snug">
                      Read-only inquiries for Ads
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole('editor')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newRole === 'editor'
                        ? 'bg-blue-950/40 border-blue-600/70 text-blue-200'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#8C8070] hover:text-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Editor</span>
                      {newRole === 'editor' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[10px] mt-1 text-[#8C8070] leading-snug">
                      Content & CRM management
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewRole('super_admin')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      newRole === 'super_admin'
                        ? 'bg-[#521D2B]/50 border-[#D6B56D]/70 text-[#D6B56D]'
                        : 'bg-white/[0.02] border-white/[0.06] text-[#8C8070] hover:text-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Super Admin</span>
                      {newRole === 'super_admin' && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div className="text-[10px] mt-1 text-[#8C8070] leading-snug">
                      Full control & team management
                    </div>
                  </button>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#521D2B] to-[#73273B] hover:from-[#662335] hover:to-[#852C44] text-[#FAF7F2] border border-[#D6B56D]/40 text-xs font-medium transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {isPending ? 'Creating Account...' : 'Create Team Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: CHANGE ROLE */}
      {/* ==================================================================== */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#181310] border border-[#D6B56D]/30 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
            <button
              onClick={() => setEditingRoleUser(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8C8070] hover:text-[#FAF7F2] hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif text-[#FAF7F2] font-normal">
              Change Permissions
            </h3>
            <p className="text-xs text-[#8C8070] mt-1">
              Select new role for <span className="text-[#FAF7F2] font-medium">{editingRoleUser.full_name}</span> ({editingRoleUser.email}).
            </p>

            <div className="space-y-2 mt-5">
              {(['viewer', 'editor', 'super_admin'] as const).map((roleOption) => (
                <button
                  key={roleOption}
                  onClick={() => handleUpdateRole(roleOption)}
                  disabled={isPending}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    editingRoleUser.role === roleOption
                      ? 'bg-[#521D2B]/40 border-[#D6B56D]/60 text-[#FAF7F2]'
                      : 'bg-white/[0.02] border-white/[0.06] text-[#8C8070] hover:text-[#FAF7F2] hover:bg-white/[0.04]'
                  }`}
                >
                  <div>
                    <div className="text-xs font-semibold capitalize">
                      {roleOption === 'viewer'
                        ? 'Viewer (Read-Only: Inquiries for Ads)'
                        : roleOption === 'editor'
                        ? 'Editor (Content & Inquiries)'
                        : 'Super Admin (Full Access)'}
                    </div>
                    <div className="text-[10px] text-[#8C8070] mt-0.5">
                      {roleOption === 'viewer'
                        ? 'Can view leads & numbers, cannot modify status or delete'
                        : roleOption === 'editor'
                        ? 'Can update leads, manage venues & services'
                        : 'Owner access to users, settings, and entire database'}
                    </div>
                  </div>
                  {editingRoleUser.role === roleOption && (
                    <Check className="w-4 h-4 text-[#D6B56D] shrink-0" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingRoleUser(null)}
                className="px-4 py-2 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: RESET PASSWORD */}
      {/* ==================================================================== */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#181310] border border-[#D6B56D]/30 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.7)]">
            <button
              onClick={() => setResettingUser(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#8C8070] hover:text-[#FAF7F2] hover:bg-white/[0.05] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-serif text-[#FAF7F2] font-normal">
              Reset User Password
            </h3>
            <p className="text-xs text-[#8C8070] mt-1">
              Set a new login password for <span className="text-[#FAF7F2]">{resettingUser.email}</span>.
            </p>

            {resetError && (
              <div className="mt-3 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resetError}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4 mt-5">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono text-[#FAF7F2]">
                    New Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setResetPasswordVal(generateRandomPassword())}
                    className="text-[10px] text-[#D6B56D] hover:underline flex items-center gap-1 font-mono cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8070] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={resetPasswordVal}
                    onChange={(e) => setResetPasswordVal(e.target.value)}
                    className="w-full bg-white/[0.04] border border-[#D6B56D]/20 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#FAF7F2] font-mono tracking-wider focus:outline-none focus:border-[#D6B56D]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#521D2B] to-[#73273B] text-[#FAF7F2] border border-[#D6B56D]/40 text-xs font-medium cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Updating...' : 'Save New Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: DELETE CONFIRMATION */}
      {/* ==================================================================== */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#181310] border border-rose-900/40 p-6 shadow-[0_12px_48px_rgba(0,0,0,0.7)] text-center">
            <div className="w-12 h-12 rounded-full bg-rose-950/40 border border-rose-800/50 text-rose-400 mx-auto flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-serif text-[#FAF7F2]">
              Delete Team Account?
            </h3>
            <p className="text-xs text-[#8C8070] mt-2 leading-relaxed">
              Are you sure you want to delete <span className="text-[#FAF7F2] font-medium">{deletingUser.full_name}</span> ({deletingUser.email})? This action cannot be undone.
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2.5 rounded-xl text-xs text-[#B8ADA3] hover:text-[#FAF7F2] hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                disabled={isPending}
                className="px-5 py-2.5 rounded-xl bg-rose-900/60 hover:bg-rose-800 text-rose-100 border border-rose-700/60 text-xs font-medium cursor-pointer disabled:opacity-50"
              >
                {isPending ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

