"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Plus, 
  RefreshCw, 
  Search, 
  Shield, 
  UserPlus, 
  XCircle 
} from "lucide-react";

type AdminData = {
  email: string;
  assignedBy: string;
  assignedAt: Date;
};

type RequestType = {
  _id: string;
  type: 'fundraiser' | 'wallet_topup';
  userId: string;
  userEmail: string;
  status: 'pending' | 'approved' | 'rejected';
  fundraiserId?: string;
  amount?: number;
  reason: string;
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectedAt?: Date;
  rejectedBy?: string;
  rejectionReason?: string;
  user?: {
    email: string;
    firstName: string;
    lastName: string;
  };
};

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Login form state
  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState("");
  
  // Admin data
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [requests, setRequests] = useState<RequestType[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, adminCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsAuthenticated(true);
        setAdminData(data.admin);
        fetchRequests();
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch requests
  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/requests");
      const data = await response.json();

      if (response.ok) {
        setRequests(data.requests);
      } else {
        setError("Failed to fetch requests");
      }
    } catch (err) {
      setError("An error occurred while fetching requests");
    }
  };

  // Process request
  const processRequest = async (requestId: string, action: 'approve' | 'reject') => {
    setActionLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          adminEmail: adminData?.email,
          rejectionReason: action === 'reject' ? rejectionReason : undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        fetchRequests();
        setShowRejectionModal(false);
        setRejectionReason("");
      } else {
        setError(data.message || "Failed to process request");
      }
    } catch (err) {
      setError("An error occurred while processing request");
    } finally {
      setActionLoading(false);
    }
  };

  // Show rejection modal
  const handleReject = (request: RequestType) => {
    setSelectedRequest(request);
    setShowRejectionModal(true);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Access the admin dashboard to manage requests and approvals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="adminCode" className="text-sm font-medium">
                  Admin Code
                </label>
                <input
                  id="adminCode"
                  type="password"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter admin code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                <LogIn className="w-4 h-4 mr-2" />
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome, {adminData?.email}
              </p>
            </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                  <Shield className="w-4 h-4 inline mr-2" />
                  Admin
                </span>
                <Button variant="outline" onClick={() => setIsAuthenticated(false)}>
                  Logout
                </Button>
              </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList>
            <TabsTrigger value="requests">Approval Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending Only</TabsTrigger>
            <TabsTrigger value="history">Approval History</TabsTrigger>
          </TabsList>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Approval Requests</CardTitle>
                    <CardDescription>
                      Review and manage fundraiser and wallet top-up requests
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={fetchRequests}>
                      <RefreshCw className={`w-4 h-4 mr-2 ${actionLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left">Type</th>
                        <th className="border border-border px-4 py-2 text-left">User</th>
                        <th className="border border-border px-4 py-2 text-left">Amount</th>
                        <th className="border border-border px-4 py-2 text-left">Reason</th>
                        <th className="border border-border px-4 py-2 text-left">Status</th>
                        <th className="border border-border px-4 py-2 text-left">Date</th>
                        <th className="border border-border px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((request) => (
                        <tr key={request._id} className="border border-border hover:bg-muted/50">
                          <td className="border border-border px-4 py-2">
                            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                              {request.type === 'fundraiser' ? 'Fundraiser' : 'Wallet Top-up'}
                            </span>
                          </td>
                          <td className="border border-border px-4 py-2">
                            <div>
                              <div className="font-medium">{request.user?.email || request.userEmail}</div>
                              <div className="text-sm text-muted-foreground">
                                {request.user?.firstName} {request.user?.lastName}
                              </div>
                            </div>
                          </td>
                          <td className="border border-border px-4 py-2">
                            {request.type === 'wallet_topup' && request.amount 
                              ? `$${request.amount}` 
                              : '-'}
                          </td>
                          <td className="border border-border px-4 py-2 max-w-xs truncate" title={request.reason}>
                            {request.reason}
                          </td>
                          <td className="border border-border px-4 py-2">
                            <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {getStatusIcon(request.status)}
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="border border-border px-4 py-2">{formatDate(request.createdAt)}</td>
                          <td className="border border-border px-4 py-2">
                            <div className="flex gap-2">
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => processRequest(request._id, 'approve')}
                                    disabled={actionLoading}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                  >
                                    <CheckCircle className="w-4 h-4 inline mr-1" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(request)}
                                    disabled={actionLoading}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                  >
                                    <XCircle className="w-4 h-4 inline mr-1" />
                                    Reject
                                  </button>
                                </>
                              )}
                              {request.status === 'approved' && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  Approved
                                </span>
                              )}
                              {request.status === 'rejected' && (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-sm">
                                  <XCircle className="w-4 h-4 inline mr-1" />
                                  Rejected
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {requests.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No requests found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>
                  Requests waiting for approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left">Type</th>
                        <th className="border border-border px-4 py-2 text-left">User</th>
                        <th className="border border-border px-4 py-2 text-left">Amount</th>
                        <th className="border border-border px-4 py-2 text-left">Reason</th>
                        <th className="border border-border px-4 py-2 text-left">Date</th>
                        <th className="border border-border px-4 py-2 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter(r => r.status === 'pending')
                        .map((request) => (
                          <tr key={request._id} className="border border-border hover:bg-muted/50">
                            <td className="border border-border px-4 py-2">
                              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                                {request.type === 'fundraiser' ? 'Fundraiser' : 'Wallet Top-up'}
                              </span>
                            </td>
                            <td className="border border-border px-4 py-2">
                              <div className="font-medium">{request.user?.email || request.userEmail}</div>
                            </td>
                            <td className="border border-border px-4 py-2">
                              {request.type === 'wallet_topup' && request.amount 
                                ? `$${request.amount}` 
                                : '-'}
                            </td>
                            <td className="border border-border px-4 py-2 max-w-xs truncate" title={request.reason}>
                              {request.reason}
                            </td>
                            <td className="border border-border px-4 py-2">{formatDate(request.createdAt)}</td>
                            <td className="border border-border px-4 py-2">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => processRequest(request._id, 'approve')}
                                  disabled={actionLoading}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                                >
                                  <CheckCircle className="w-4 h-4 inline mr-1" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(request)}
                                  disabled={actionLoading}
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                                >
                                  <XCircle className="w-4 h-4 inline mr-1" />
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {requests.filter(r => r.status === 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No pending requests
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Approval History</CardTitle>
                <CardDescription>
                  Previously processed requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border px-4 py-2 text-left">Type</th>
                        <th className="border border-border px-4 py-2 text-left">User</th>
                        <th className="border border-border px-4 py-2 text-left">Amount</th>
                        <th className="border border-border px-4 py-2 text-left">Status</th>
                        <th className="border border-border px-4 py-2 text-left">Processed By</th>
                        <th className="border border-border px-4 py-2 text-left">Processed At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests
                        .filter(r => r.status !== 'pending')
                        .map((request) => (
                          <tr key={request._id} className="border border-border hover:bg-muted/50">
                            <td className="border border-border px-4 py-2">
                              <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                                {request.type === 'fundraiser' ? 'Fundraiser' : 'Wallet Top-up'}
                              </span>
                            </td>
                            <td className="border border-border px-4 py-2">
                              <div className="font-medium">{request.user?.email || request.userEmail}</div>
                            </td>
                            <td className="border border-border px-4 py-2">
                              {request.type === 'wallet_topup' && request.amount 
                                ? `$${request.amount}` 
                                : '-'}
                            </td>
                            <td className="border border-border px-4 py-2">
                              <span className={`px-2 py-1 rounded text-sm flex items-center gap-1 ${
                                request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {getStatusIcon(request.status)}
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </td>
                            <td className="border border-border px-4 py-2">
                              {request.status === 'approved' ? request.approvedBy : request.rejectedBy}
                            </td>
                            <td className="border border-border px-4 py-2">
                              {request.status === 'approved' 
                                ? formatDate(request.approvedAt!)
                                : formatDate(request.rejectedAt!)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  {requests.filter(r => r.status !== 'pending').length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No approval history
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Rejection Modal */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${showRejectionModal ? 'block' : 'hidden'}`}>
        <div className="bg-card rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-2">Reject Request</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please provide a reason for rejecting this request
            </p>
            <div className="space-y-4">
              <div>
                <label htmlFor="rejectionReason" className="text-sm font-medium">
                  Rejection Reason
                </label>
                <input
                  id="rejectionReason"
                  type="text"
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowRejectionModal(false)}
                className="px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => processRequest(selectedRequest!._id, 'reject')}
                disabled={!rejectionReason || actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 inline mr-2" />
                Reject Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
