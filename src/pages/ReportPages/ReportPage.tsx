import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate
import { ChevronRight, Users, Wrench, UserCheck, Settings } from 'lucide-react';
import { appRoutes } from '@/routes/appRoutes';
import PageHeader from '@/components/masterPage.components/PageHeader';

const ReportsDashboard = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const masterReports = [
    {
      id: 'customer',
      title: 'Customer Wise',
      description: 'Detailed reports organized by customer accounts',
      icon: Users,
      route: appRoutes.reportRoutes.children.customerWise,
    },
    {
      id: 'machine',
      title: 'Machine Model Wise',
      description: 'Reports categorized by machine models and types',
      icon: Settings,
      route: appRoutes.reportRoutes.children.machineModelWise,
    },
    {
      id: 'technician',
      title: 'Technician Wise',
      description: 'Performance and activity reports by technician',
      icon: UserCheck,
      route: appRoutes.reportRoutes.children.technicianWise,
    },
    {
      id: 'spares',
      title: 'Spare Parts Wise',
      description: 'Inventory and usage reports for spare parts',
      icon: Wrench,
      route: appRoutes.reportRoutes.children.sparesWise,
    },
  ];

  const handleCardClick = (report:any) => {
    setSelectedReport(report.id);
    // Navigate to the report route
    navigate(report.route);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <PageHeader
          title='Reports'
          />
          <p className="text-gray-600 text-md">Generate and view comprehensive business reports</p>
        </div>

        {/* Master Reports Section */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Master Reports</h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {masterReports.map((report) => {
                const IconComponent = report.icon;
                return (
                  <div
                    key={report.id}
                    onClick={() => handleCardClick(report)}
                    className={`
                      p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 flex items-start justify-between
                      hover:border-blue-500 hover:bg-blue-50
                      ${selectedReport === report.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="flex-1 ml-3 flex flex-col gap-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                          {report.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {report.description}
                        </p>
                      </div>
                    </div>
                    {/* <ChevronRight className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" /> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Optional: Selected Report Info */}
        {selectedReport && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-900">
                Selected: {masterReports.find(r => r.id === selectedReport)?.title}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              You have selected the{' '}
              <strong>{masterReports.find(r => r.id === selectedReport)?.title.toLowerCase()}</strong>{' '}
              report. You are now being redirected to the detailed view.
            </p>
            <button
              onClick={() => setSelectedReport(null)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsDashboard;