import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { type ClientProject } from '../../services/adminApi';
import axios from 'axios';

interface ClientDashboardResponse {
  status: 'accessible' | 'blocked';
  message?: string;
  project?: ClientProject;
}

export const ClientProjectView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ClientDashboardResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchClientDashboard(id);
    }
  }, [id]);

  const fetchClientDashboard = async (projectId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token') || localStorage.getItem('admin_token');
      const res = await axios.get(`http://127.0.0.1:8000/api/v1/client/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      setData(res.data.data || res.data);
    } catch (err: any) {
      if (err.response?.data?.data?.status === 'blocked') {
        setData(err.response.data.data);
      } else {
        setError(err.response?.data?.message || 'Failed to load project dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
        <div className="text-center text-white">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="fw-bold">Securing Client Portal Authentication...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4">
        <div className="card bg-secondary bg-opacity-20 border-secondary text-white text-center p-5 rounded-4 shadow-lg max-w-md w-100">
          <div className="mb-3 text-warning display-4">⚠️</div>
          <h3 className="fw-bold">Error Loading Project</h3>
          <p className="text-muted">{error}</p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CONDITION 1: BLOCKED ACCESS STATE (FULL SCREEN LOCKED UI)
  // ══════════════════════════════════════════════════════════════════════════
  if (data?.status === 'blocked') {
    return (
      <div className="min-vh-100 bg-dark d-flex align-items-center justify-content-center p-4 position-relative overflow-hidden">
        <div className="card bg-dark border-danger border-opacity-50 text-white text-center p-5 rounded-4 shadow-lg max-w-lg w-100 position-relative z-1">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" style={{ width: '80px', height: '80px' }}>
            <i className="fa-solid fa-lock display-5"></i>
          </div>

          <span className="badge bg-danger bg-opacity-20 text-danger border border-danger border-opacity-25 px-3 py-2 rounded-pill text-uppercase mb-3 font-monospace">
            Portal Access Suspended
          </span>

          <h2 className="fw-bold mb-3">Project Access Locked</h2>

          <div className="bg-danger bg-opacity-10 border border-danger border-opacity-25 rounded-3 p-4 text-danger-emphasis mb-4 text-start">
            <h6 className="fw-bold text-danger mb-2">Notice from Fikriti Management:</h6>
            "{data.message || 'Access to this project portal has been temporarily suspended.'}"
          </div>

          <p className="small text-muted border-top border-secondary border-opacity-25 pt-3 mb-0">
            If you believe this is an error or wish to settle an outstanding milestone payment, please contact your representative directly.
          </p>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CONDITION 2: ACCESSIBLE DASHBOARD STATE
  // ══════════════════════════════════════════════════════════════════════════
  const project = data?.project;
  if (!project) return null;

  const totalCost = Number(project.total_cost || 0);
  const amountPaid = Number(project.amount_paid || 0);
  const remaining = typeof project.remaining_balance === 'number'
    ? project.remaining_balance
    : Math.max(0, totalCost - amountPaid);

  const paidPercentage = totalCost > 0 ? Math.min(100, Math.round((amountPaid / totalCost) * 100)) : 100;

  return (
    <div className="min-vh-100 bg-dark text-white p-4 p-md-5 font-sans">
      <div className="container max-w-5xl mx-auto space-y-4">
        {/* Top Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between pb-4 border-bottom border-secondary border-opacity-25 gap-3">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
              <span className="small font-monospace text-success text-uppercase fw-bold">Live Client Portal</span>
            </div>
            <h1 className="fw-bold text-white mb-0">{project.title}</h1>
            <p className="text-muted small mb-0">{project.client?.company_name || 'Client Project Overview'}</p>
          </div>
          <div>
            <span className="badge bg-primary bg-opacity-20 text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill font-monospace text-uppercase">
              Status: {project.status}
            </span>
          </div>
        </div>

        {/* Financial Progress Bar */}
        <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 rounded-4 p-4 my-4">
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 gap-2">
            <div>
              <h5 className="fw-bold mb-1">Financial Summary & Payment Status</h5>
              <p className="text-muted small mb-0">Total project agreement value & received payments</p>
            </div>
            <div className="text-sm-end">
              <span className="display-6 fw-bold text-white">${totalCost.toLocaleString()}</span>
              <span className="small text-muted d-block">{project.currency || 'USD'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="d-flex justify-content-between small fw-bold mb-1">
              <span className="text-success">Paid: ${amountPaid.toLocaleString()} ({paidPercentage}%)</span>
              <span className={remaining > 0 ? 'text-danger' : 'text-muted'}>
                Remaining Balance: ${remaining.toLocaleString()}
              </span>
            </div>
            <div className="progress bg-dark p-1 rounded-pill" style={{ height: '22px' }}>
              <div
                className="progress-bar bg-gradient-primary rounded-pill transition-all"
                role="progressbar"
                style={{ width: `${paidPercentage}%`, backgroundColor: '#0d83fd' }}
                aria-valuenow={paidPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        </div>

        {/* Project Details Cards */}
        <div className="row g-3 my-4">
          <div className="col-md-4">
            <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 p-4 rounded-4 h-100">
              <p className="text-uppercase small text-muted font-monospace fw-bold mb-1">Start Date</p>
              <h5 className="fw-bold mb-0">N/A</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 p-4 rounded-4 h-100">
              <p className="text-uppercase small text-muted font-monospace fw-bold mb-1">Target Deadline</p>
              <h5 className="fw-bold mb-0">N/A</h5>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 p-4 rounded-4 h-100">
              <p className="text-uppercase small text-muted font-monospace fw-bold mb-1">Access Granted</p>
              <h5 className="fw-bold text-success mb-0">Yes (Active)</h5>
            </div>
          </div>
        </div>

        {/* Description */}
        {project.description && (
          <div className="card bg-secondary bg-opacity-10 border-secondary border-opacity-25 p-4 rounded-4">
            <h6 className="text-uppercase small text-muted font-monospace fw-bold mb-2">Project Description & Scope</h6>
            <p className="mb-0 text-white-50">{project.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProjectView;
