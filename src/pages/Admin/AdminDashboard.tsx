import { Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Layout'

const stats = [
	{ label: 'Total Employees', value: '24', icon: Users, color: 'text-primary bg-primary/10' },
	{ label: 'Clocked In Today', value: '18', icon: Clock, color: 'text-green-600 bg-green-100' },
	{ label: 'Submitted Today', value: '15', icon: CheckCircle, color: 'text-blue-600 bg-blue-100' },
	{ label: 'Absent Today', value: '6', icon: AlertCircle, color: 'text-red-600 bg-red-100' },
];

const AdminDashboard = () => {
	return (
		<Navbar>
			<div className="min-h-screen bg-gray-50 p-6">
				<div className="space-y-6 max-w-7xl mx-auto">
				
				<div>
					<p className="text-gray-500 mt-1">Overview of WFH attendance</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{stats.map((stat) => (
					<div
						key={stat.label}
						className="bg-white rounded-xl shadow p-4 flex flex-col justify-between"
					>
						<div className="flex items-center justify-between pb-2">
						<h2 className="text-sm font-medium text-gray-500">
							{stat.label}
						</h2>
						<div className={`rounded-lg p-2 ${stat.color}`}>
							<stat.icon className="h-4 w-4" />
						</div>
						</div>

						<p className="text-3xl font-bold text-gray-900">
						{stat.value}
						</p>
					</div>
					))}
				</div>

				<div className="bg-white rounded-xl shadow p-6">
					<h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

					<div className="space-y-4">
					{[
						{ name: 'Alice Johnson', action: 'Clocked In', time: '08:45 AM', dept: 'Engineering' },
						{ name: 'Bob Smith', action: 'Clocked Out', time: '05:02 PM', dept: 'Marketing' },
						{ name: 'Carol Davis', action: 'Submitted Attendance', time: '05:15 PM', dept: 'Design' },
						{ name: 'Dave Wilson', action: 'Clocked In', time: '09:00 AM', dept: 'Sales' },
					].map((activity, i) => (
						<div
						key={i}
						className="flex items-center justify-between py-2 border-b last:border-0"
						>
						<div className="flex items-center gap-3">
							<div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">
							{activity.name
								.split(' ')
								.map((n) => n[0])
								.join('')}
							</div>

							<div>
							<p className="text-sm font-medium text-gray-900">
								{activity.name}
							</p>
							<p className="text-xs text-gray-500">
								{activity.dept}
							</p>
							</div>
						</div>

						<div className="text-right">
							<p className="text-sm text-gray-900">
							{activity.action}
							</p>
							<p className="text-xs text-gray-500">
							{activity.time}
							</p>
						</div>
						</div>
					))}
					</div>
				</div>

				</div>
			</div>
		</Navbar>
	);
};

export default AdminDashboard;