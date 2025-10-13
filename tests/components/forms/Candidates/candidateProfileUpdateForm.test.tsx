import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProfileUpdateForm from "@/components/Forms/candidates/updateProfile";
import { updateCandidate } from "@/api/candidates/candidates";
import { toast } from "react-toastify";

beforeAll(() => {
  // Force UTC timezone globally
  process.env.TZ = "UTC";
});

// Mock dependencies
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/api/candidates/candidates", () => ({
  updateCandidate: vi.fn(() => Promise.resolve({ status: 200 })),
}));

vi.mock("@/api/candidates/preferredJob", () => ({
  createContactPreferredJobType: vi.fn(),
  deleteContactPreferredJobType: vi.fn(),
}));

vi.mock("@/api/candidates/hiringType", () => ({
  createContactHiringType: vi.fn(),
  deleteContactHiringType: vi.fn(),
}));

// Mock components
vi.mock("@/components/Elements/utils/location-autocomplete", () => ({
  default: () => <div>LocationAutocomplete</div>,
}));

vi.mock("react-datepicker", () => ({
  default: ({ selected, onChange, placeholderText }: any) => (
    <input
      type="text"
      value={selected ? selected.toISOString() : ""}
      onChange={(e) => onChange(new Date(e.target.value))}
      placeholder={placeholderText}
      data-testid="datepicker"
    />
  ),
}));

describe("ProfileUpdateForm", () => {
  const mockInitialValues = {
    firstName: "John",
    lastName: "Doe",
    emailId: "john@example.com",
    primaryNumber: "+1234567890",
    secondaryNumber: "+0987654321",
    designation: "Software Engineer",
    techRole: "Frontend Developer",
    companyName: "Tech Corp",
    totalExperience: 5,
    currentSalary: 100000,
    expectedSalary: 120000,
    noticePeriod: 30,
    isActive: true,
    isExpectedCtcNegotiable: false,
    highestEducation: "Bachelor's Degree",
    currentLocation: { locationId: 1, locationDetails: "New York" },
    address1: "123 Main St",
    addressLocality: "Downtown",
    pinCode: "10001",
    maritalStatus: "Single",
    differentlyAbled: false,
    differentlyAbledType: "Deaf",
    dob: "2000-12-19",
    gender: "Male",
    linkedin: "https://linkedin.com/in/johndoe",
    contactId: 1,
  };

  const mockProps = {
    initialValues: mockInitialValues,
    id: 1,
    autoClose: vi.fn(),
    masterLocations: [],
    preferredJobModes: [],
    hiringTypes: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with initial values", () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    expect(screen.getByDisplayValue("John")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("+1234567890")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Software Engineer")).toBeInTheDocument();
  });

  // it("handles form submission successfully", async () => {
  //   render(<ProfileUpdateForm {...mockProps} />);
    
  //   const submitButton = screen.getByRole("button", { name: "Update" });
  //   fireEvent.click(submitButton);
    
  //   await waitFor(() => {
  //     expect(updateCandidate).toHaveBeenCalled();
  //     expect(mockProps.autoClose).toHaveBeenCalled();
  //     expect(toast.success).toHaveBeenCalledWith(
  //       "Profile updated successfully",
  //       { position: "top-right" }
  //     );
  //   });
  // });

//   it("shows error message when form submission fails", async () => {
//   // Mock the API to reject with an error
//   vi.mocked(updateCandidate).mockRejectedValueOnce({
//     response: {
//       status: 400,
//       data: { message: "Update failed" }
//     }
//   });

//   render(<ProfileUpdateForm {...mockProps} />);
  
//   const submitButton = screen.getByRole("button", { name: "Update" });
//   fireEvent.click(submitButton);
  
//   await waitFor(() => {
//     expect(toast.error).toHaveBeenCalledWith(
//       "Update failed", // Expected error message
//       { position: "top-right" }
//     );
//   });
// });



  it("shows confirmation dialog when setting to inactive", async () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    const inactiveRadio = screen.getByLabelText("Inactive");
    fireEvent.click(inactiveRadio);
    
    await waitFor(() => {
      expect(screen.getByText("Confirm Status Change")).toBeInTheDocument();
    });
  });

  it("handles date picker changes", async () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    const datePicker = screen.getByTestId("datepicker");
    fireEvent.change(datePicker, { target: { value: "1994-12-31" } });
    
    await waitFor(() => {
      expect(datePicker).toHaveValue(new Date("1994-12-31").toISOString());
    });
  });

  it("toggles differently abled fields", async () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    fireEvent.click(yesRadio);
    
    await waitFor(() => {
      expect(screen.getByText("Differently Abled Type")).toBeInTheDocument();
    });
  });

  it("handles salary negotiability radio buttons", async () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    const yesRadio = screen.getByRole("radio", { name: "Yes" });
    fireEvent.click(yesRadio);
    
    await waitFor(() => {
      expect(yesRadio).toBeChecked();
    });
  });

  it("handles cancel button click", async () => {
    render(<ProfileUpdateForm {...mockProps} />);
    
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    
    await waitFor(() => {
      expect(mockProps.autoClose).toHaveBeenCalled();
    });
  });
});