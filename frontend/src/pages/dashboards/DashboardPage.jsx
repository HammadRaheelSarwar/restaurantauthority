import React from 'react';
import { useAuth } from '../../context/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import OrgAdminDashboard from './OrgAdminDashboard';
import RestaurantManagerDashboard from './RestaurantManagerDashboard';
import AssessorDashboard from './AssessorDashboard';
import CertificationManagerDashboard from './CertificationManagerDashboard';
import ViewerDashboard from './ViewerDashboard';

/**
 * Master Dashboard Router
 * Strictly renders distinct, role-specific operational dashboards
 * with dedicated KPIs, operational queues, and permissions.
 */
export default function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role || 'super_admin';

  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboard />;

    case 'admin':
    case 'organization_admin':
    case 'restaurant_operator':
      return <OrgAdminDashboard />;

    case 'restaurant_manager':
    case 'manager':
      return <RestaurantManagerDashboard />;

    case 'electrical_assessor':
    case 'assessor':
      return <AssessorDashboard />;

    case 'certification_manager':
      return <CertificationManagerDashboard />;

    case 'viewer':
    default:
      return <ViewerDashboard />;
  }
}
