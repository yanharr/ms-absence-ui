import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import Navbar from "../../components/Layout";
import Pagination from "../../components/Pagination";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../../services/employees.service";
import { showToast } from "../../lib/toast";
import DatePicker from "react-datepicker";
import { TableHeaderCell, TableData } from "../../components/ui/Table";
import { Search } from "../../components/ui/Search";

interface Employee {
	id: string;
	employee_id: string;
	name: string;
	email: string;
	dob: string;
	address: string;
	department: string;
	gender: string;
	phone_number: string;
	hired_date: string;
}

type CreateEmployeeDto = Omit<Employee, "id"> & {
  	password: string;
};

type UpdateEmployeeDto = Omit<Employee, "id">;

type FormType = Employee | CreateEmployeeDto | UpdateEmployeeDto;

const EmployeeList = () => {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [search, setSearch] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState<Employee | UpdateEmployeeDto | CreateEmployeeDto| null>(null);
	const [isLoading, setIsLoading] = useState<Boolean>(false)
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [page, setPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	const [isModalUpdate, setIsModalUpdate] = useState<Boolean>(false)
	const [errorEID, setErrorEID] = useState({employee_id: ""});
	const [idEmployee, setIdEmployee] = useState<string>("")
	const [emailError, setEmailError] = useState("");

	const createEmptyEmployee = (): Employee => ({
		id: "",
		employee_id: "",
		name: "",
		email: "",
		dob: "",
		address: "",
		department: "",
		gender: "",
		phone_number: "",
		hired_date: "",
  	});

	const createEmptyEmployeeWithoutId = (): CreateEmployeeDto => ({
		employee_id: "",
		name: "",
		email: "",
		dob: "",
		address: "",
		department: "",
		gender: "",
		phone_number: "",
		hired_date: "",
		password: "",
	});

	const [form, setForm] = useState<Employee | CreateEmployeeDto | UpdateEmployeeDto>(createEmptyEmployee());

	const callGetEmployeesService = async (search?: string, page?: number, limit?: number) => {
		try {
			setIsLoading(true)
			const data = await getEmployees(search, page, limit);
			setEmployees(data.data)
			setLastPage(data.lastPage)
		} catch (error) {
			showToast.error("Something Wrong?")
		} finally {
			setIsLoading(false)
		}
	}

    useEffect(() => {
        callGetEmployeesService(debouncedSearch, page)
    }, [debouncedSearch, page])

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500)

		return () => {
			clearTimeout(handler)
		}
	}, [search])

	const openAdd = () => {
		setEditingEmployee(null);
		setForm(createEmptyEmployeeWithoutId());
		setModalOpen(true);
	};

	const openEdit = (emp: Employee) => {
		const { id, ...dataWithoutId} = emp
		setEditingEmployee({...emp});
		setIdEmployee(emp.id)
		setForm({ ...dataWithoutId });
		setModalOpen(true);
		setIsModalUpdate(true)
	};

	const handleEmployeeIdChange = (value: string) => {
		updateField("employee_id", value);

		if (value.length > 0 && value.length < 6) {
			setErrorEID((prev) => ({
			...prev,
			employee_id: "minimum Employee Id 6 character"
			}));
		} else {
			setErrorEID((prev) => ({
			...prev,
			employee_id: ""
			}));
		}
	};

	const handleSave = async () => {
		let requiredFields: (keyof Employee)[] = [
			"employee_id",
			"name",
			"email",
			"dob",
			"address",
			"department",
			"gender",
			"phone_number",
			"hired_date",
		];
		
		const hasEmptyField = requiredFields.some(
			(field) => !(form as Record<string, any>)[field]
		);

		if (hasEmptyField) {
			showToast.error('please complete the form!')
			return;
		}

		try {
			setIsLoading(true);

			if (editingEmployee) {
				await updateEmployee(form, idEmployee);
			} else {
				await createEmployee(form);
			}

			await callGetEmployeesService();

			setModalOpen(false);
		} catch (error) {
			showToast.error("an error occured when create employee")
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		try {
			setIsLoading(true)
			await deleteEmployee(idEmployee)
			await callGetEmployeesService();
		} catch (error) {
			showToast.error("an error occured when delete employee")
		} finally {
			setModalOpen(false)
			setIsLoading(false)
			showToast.success('delete success')
		}

	}

	const isPasswordValid =
		!editingEmployee &&
		"password" in form &&
		/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password || "");

	const updateField = (field: keyof FormType, value: string) => {
		setForm((prev) => ({ ...prev, [field]: value }));
	};


  return (
    <Navbar>
        <div className="p-6 space-y-6 bg-gray-50 p-6">
        	<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold">Employees</h1>
					<p className="text-gray-500">Manage employee master data</p>
				</div>
            	<Button onClick={openAdd}>Add Employee</Button>
        	</div>

			<Card>
				<CardHeader>
					<CardTitle>Employee List</CardTitle>
					<Search
						className="w-full max-w-sm px-3 py-2 mt-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-200 transition"
						placeholder="Search by name or id"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</CardHeader>

				<CardContent>
					<div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
						<table className="min-w-full divide-y divide-gray-200 text-sm">
							<thead className="bg-gray-50">
							<tr>
								<TableHeaderCell>
									Employee ID
								</TableHeaderCell>
								<TableHeaderCell>
									Name
								</TableHeaderCell>
								<TableHeaderCell>
									Email
								</TableHeaderCell>
								<TableHeaderCell>
									Department
								</TableHeaderCell>
								<TableHeaderCell>
									Position
								</TableHeaderCell>
								<TableHeaderCell>
									Action
								</TableHeaderCell>
							</tr>
							</thead>

							<tbody className="bg-white divide-y divide-gray-200">
							{employees.map((emp, index) => (
								<tr
									key={emp.id}
									className={`hover:bg-gray-100 transition-colors ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									}`}
								>
									<TableData>
										{emp.employee_id}
									</TableData>
									<TableData>
										{emp.name}
									</TableData>
									<TableData>
										{emp.email}
									</TableData>
									<TableData>
										{emp.department}
									</TableData>
									<TableData>
										{emp.phone_number}
									</TableData>
									<TableData>
										<Button onClick={() => openEdit(emp)}>Edit</Button>
									</TableData>
								</tr>
							))}
							{employees.length === 0 && (
								<tr>
								<td
									colSpan={6}
									className="text-center py-6 text-gray-500 italic"
								>
									No employees found
								</td>
								</tr>
							)}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			<Pagination
				currentPage={page}
				totalPages={lastPage}
				onPageChange={(p) => setPage(p)}
			/>

			{modalOpen && (
				<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
					<div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg space-y-6">
						<h2 className="text-2xl font-bold text-gray-800">
							{editingEmployee ? "Edit Employee" : "Add Employee"}
						</h2>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">Employee ID</label>
							<input
								className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
								errorEID.employee_id ? "border-red-500" : "border-gray-300"
								}`}
								value={form.employee_id}
								onChange={(e) => handleEmployeeIdChange(e.target.value)}
								disabled={!!editingEmployee}
								placeholder="E.g., EMP001"
							/>
							{errorEID.employee_id && (
								<p className="text-xs text-red-500">{errorEID.employee_id}</p>
							)}
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">Full Name</label>
							<input
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.name}
								onChange={(e) => updateField("name", e.target.value)}
								placeholder="John Doe"
							/>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">Email</label>
							<input
								type="email"
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.email}
								onChange={(e) => updateField("email", e.target.value)}
								placeholder="email@example.com"
							/>
						</div>

						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">Address</label>
							<input
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.address}
								onChange={(e) => updateField("address", e.target.value)}
								placeholder="Address"
							/>
						</div>

						<div className="space-y-1">
						<label className="block text-sm font-medium text-gray-700">Phone number</label>
							<input
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.phone_number || "+62"}
								onChange={(e) => {
								let value = e.target.value;
								if (!value.startsWith("+62")) value = "+62";
								const numbersOnly = value.replace(/^\+62/, "").replace(/\D/g, "");
								updateField("phone_number", `+62${numbersOnly}`);
								}}
								placeholder="+62 812-3456-7890"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Department</label>
								<input
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.department}
								onChange={(e) => updateField("department", e.target.value)}
								placeholder="IT, HR, etc."
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Hired Date</label>
								<DatePicker
								selected={form.hired_date ? new Date(form.hired_date) : null}
								onChange={(date: Date | null) => {
									if (date) updateField("hired_date", date.toISOString().split("T")[0]);
								}}
								dateFormat="yyyy-MM-dd"
								placeholderText="2000-02-01"
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								showYearDropdown
								scrollableYearDropdown
								yearDropdownItemNumber={100}
								maxDate={new Date()}
								/>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-sm font-medium text-gray-700">Date of Birth</label>
								<DatePicker
								selected={form.dob ? new Date(form.dob) : null}
								onChange={(date: Date | null) => {
									if (date) updateField("dob", date.toISOString().split("T")[0]);
								}}
								dateFormat="yyyy-MM-dd"
								placeholderText="2000-02-01"
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								showYearDropdown
								scrollableYearDropdown
								yearDropdownItemNumber={100}
								maxDate={new Date()}
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700">Gender</label>
								<select
								className="w-full px-3 py-2 border rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.gender}
								onChange={(e) => updateField("gender", e.target.value)}
								>
								<option value="">Select gender</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								</select>
							</div>
						</div>

						{!editingEmployee && "password" in form && (
						<div className="space-y-1">
							<label className="block text-sm font-medium text-gray-700">Password for employee account</label>
							<input
								type="password"
								className="w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border-gray-300"
								value={form.password || ""}
								onChange={(e) => updateField("password", e.target.value)}
								placeholder="********"
							/>
							{form.password && !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(form.password) && (
								<p className="text-xs text-red-500">
									Password must be at least 8 characters and include both letters and numbers
								</p>
							)}
						</div>
						)}

						<div className="flex justify-end gap-3 pt-4">
						{isModalUpdate && (
							<Button variant="danger" onClick={handleDelete}>
							Delete
							</Button>
						)}
						<Button variant="outline" onClick={() => setModalOpen(false)}>
							Cancel
						</Button>
						<Button onClick={handleSave}>
							{isLoading ? "Saving..." : editingEmployee ? "Update" : "Add"}
						</Button>
						</div>
					</div>
				</div>
			)}
        </div>
    </Navbar>
  );
};

export default EmployeeList;