import { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { showToast } from '../lib/toast';
import { LogIn, LogOut, Send, CalendarDays, UserRoundX } from 'lucide-react';
import { uploadFile } from '../services/attendance.service';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

type AttendanceStatus = 'pending' | 'clocked-in' | 'clocked-out';

const EmployeeDashboard = () => {
	const { logout } = useAuth();
	const navigate = useNavigate()

    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState<AttendanceStatus>('pending');
    const [clockInTime, setClockInTime] = useState<Date | null>(null);
    const [clockOutTime, setClockOutTime] = useState<Date | null>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<'clock-in' | 'clock-out' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [type, setType] = useState<string>('clock-in')

    useEffect(() => {
		const timer = setInterval(() => setCurrentTime(new Date()), 1000);
		return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
		const hour = currentTime.getHours();
		if (hour < 12) { 
			return 'Morning'; 
		}
		if (hour < 17) { 
			return 'Afternoon'; }
		return 'Evening';
    };

    const formatDate = () => {
		return currentTime.toLocaleDateString('en-US', { 
			weekday: 'long', 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
    };

    const formatTime = () => {
		return currentTime.toLocaleTimeString('en-US', { 
			hour: '2-digit', 
			minute: '2-digit', 
			second: '2-digit',
			hour12: false 
		});
    };

	const handleClockAction = (action: 'clock-in' | 'clock-out') => {
		setPendingAction(action);
		setPhotoFile(null);
		setShowUploadModal(true);
		setType(action)
	};

	const handleLogout = () => {
        logout();
        navigate('/login')
		showToast.info('Logout');
    }

	const handleConfirmUpload = () => {
		if (!photoFile) {
			showToast.error('Please upload a photo as proof.');
			return;
		}

		if (pendingAction === 'clock-in') {
			setClockInTime(new Date());
			setStatus('clocked-in');
		} else {
			setClockOutTime(new Date());
			setStatus('clocked-out');
		}
	
		setShowUploadModal(false);
		setPendingAction(null);
	};

	const handleVariant = (buttonType: string): 'default' | 'outline' => {
		if (buttonType === 'clock-out') {
			return status === 'clocked-in' ? 'outline' : 'default';
		}

		if (buttonType === 'clock-in') {
			return status === 'clocked-out' ? 'outline' : 'default';
		}

		return 'default';
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setPhotoFile(e.target.files[0]);
		}
	};

	const handleSubmitAttendance = async () => {
	if (status === 'pending') {
		showToast.error('Please clock in first.');
		return;
	}

	setIsSubmitting(true);

	try {
		if (!photoFile) {
			showToast.error('Please upload a photo before submitting.');
			return;
		}

		const response = await uploadFile(photoFile, type);

		if (response?.status !== 201) {
			throw new Error(response?.data?.message || 'Failed to upload attendance.');
		}
		setPhotoFile(null)
		showToast.success('Your attendance record has been sent successfully.');
		return response;


	} catch (error: any) {

		if (error.response?.data?.message) {
			showToast.error(error.response.data.message);
		} else {
			showToast.error(error.message || 'Something went wrong.');
		}

		return null;
	} finally {
		setIsSubmitting(false);
	}
	};

  return (
		<div className="min-h-screen bg-background">

		<main className="max-w-3xl mx-auto px-4 py-8 space-y-6">

			<div>
				<h1 className="text-2xl font-bold text-foreground">Good {getGreeting()}!</h1>
				<p className="text-muted-foreground mt-1">Track your work-from-home attendance</p>
			</div>

			<div className="bg-card border border-border rounded-lg p-5 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="rounded-lg bg-primary/10 p-2.5">
							<CalendarDays className="h-5 w-5 text-primary" />
						</div>
						<div>
							<p className="text-sm text-muted-foreground">{formatDate()}</p>
							<p className="text-2xl font-bold text-foreground tabular-nums">{formatTime()}</p>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

			<div className="bg-card border border-border rounded-lg p-5 shadow-sm">
				<div className="mb-3">
					<h3 className="text-base font-semibold flex items-center gap-2">
						<LogIn className="h-4 w-4 text-green-600" />
						Clock In
					</h3>
				</div>
				{clockInTime ? (
				<p className="text-sm text-muted-foreground">
					Please submit your evidence
				</p>
				) : (
				<Button
					onClick={() => handleClockAction('clock-in')}
					disabled={status !== 'pending'}
					variant={handleVariant('clock-in')}
					className="w-full gap-2"
				>
					<LogIn className="h-4 w-4" />
					Clock In
				</Button>
				)}
			</div>

			<div className="bg-card border border-border rounded-lg p-5 shadow-sm">
				<div className="mb-3">
					<h3 className="text-base font-semibold flex items-center gap-2">
						<LogOut className="h-4 w-4 text-red-600" />
						Clock Out
					</h3>
				</div>
				{clockOutTime ? (
				<p className="text-sm text-muted-foreground">
					Pease submit your evidence
				</p>
				) : (
				<Button
					onClick={() => handleClockAction('clock-out')}
					disabled={pendingAction == 'clock-in' || status == 'clocked-in'}
					variant={handleVariant('clock-out')}
					className="w-full gap-2"
				>
					<LogOut className="h-4 w-4" />
					Clock Out
				</Button>
				)}
			</div>
			</div>

			<Button
				onClick={handleSubmitAttendance}
				disabled={status === 'pending' || isSubmitting}
				className="w-full text-primary-foreground h-12 gap-2"
			>
			{isSubmitting ? (
				<>
					<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
					Submitting...
				</>
			) : (
				<>
					<Send className="h-4 w-4" />
					Submit
				</>
			)}
			</Button>
			<Button
				onClick={handleLogout}
				className="w-full bg-red-500 text-primary-foreground h-12 gap-2"
			>
				<UserRoundX className="h-4 w-4" />
				Logout
			</Button>
		</main>

		{showUploadModal && (
			<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
				<div className="bg-card rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
					<h2 className="text-lg font-semibold text-foreground mb-2">
						Upload Photo — Clock {pendingAction === 'clock-in' ? 'In' : 'Out'}
					</h2>
					<p className="text-sm text-muted-foreground mb-4">
						Please upload a photo as proof of working from home.
					</p>
					
					<div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 relative">
					{photoFile ? (
						<div className="text-sm text-foreground">
							<p className="font-medium">{photoFile.name}</p>
							<p className="text-muted-foreground text-xs mt-1">
							{(photoFile.size / 1024).toFixed(1)} KB
						</p>
						</div>
					) : (
						<div className="text-sm text-muted-foreground">
							<p>Click to select a file</p>
							<p className="text-xs mt-1">or drag and drop</p>
						</div>
					)}
					<input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
					/>
					</div>

					<div className="flex gap-3">
					<Button
						variant="outline"
						onClick={() => {
						setShowUploadModal(false);
						setPendingAction(null);
						}}
						className="flex-1 gap-2"
					>
						Cancel
					</Button>
					<Button
						onClick={handleConfirmUpload}
						className="flex-1 bg-primary text-primary-foreground gap-2"
					>
						Confirm
					</Button>
					</div>
				</div>
			</div>
		)}
		</div>
	);
};

export default EmployeeDashboard;

