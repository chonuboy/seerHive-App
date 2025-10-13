// tests/components/forms/Step1BasicDetails.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Step1BasicDetails from "@/components/Forms/jobs/Addjobsteps/Addjob-1";
import { useField } from "formik";

// Mock Formik's useField hook
vi.mock("formik", () => ({
  useField: vi.fn(),
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    job: (state = {
      formData: {
        jobTitle: "",
        jobCode: "",
        jobLocation: "",
        insertedBy: "",
        isJobActive: "",
      },
    }) => state,
  },
});

describe("Step1BasicDetails Component", () => {
  const mockUser = '"testuser"';
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(mockStore, "dispatch").mockImplementation(mockDispatch);
    
    // Default mock implementation for useField
    (useField as ReturnType<typeof vi.fn>).mockImplementation((name) => [
      {
        name,
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
      },
      {
        touched: false,
        error: "",
      },
    ]);
  });

  it("renders all sections and input fields", () => {
    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    // Basic Details section
    expect(screen.getByText("Basic Details")).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Code/i)).toBeInTheDocument();
    
    // Miscellaneous section
    expect(screen.getByText("Miscellaneous")).toBeInTheDocument();
    expect(screen.getByLabelText(/Job Post Created By/i)).toBeInTheDocument();
    expect(screen.getByText(/Job Status/i)).toBeInTheDocument();
  });

  it("displays the user name correctly in created by field", () => {
    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    const createdByInput = screen.getByLabelText(/Job Post Created By/i) as HTMLInputElement;
    expect(createdByInput.value).toBe("Testuser");
  });

  it("handles job title input change", () => {
    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    const jobTitleInput = screen.getByLabelText(/Job Title/i);
    fireEvent.change(jobTitleInput, { target: { value: "Frontend Developer" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { jobTitle: "Frontend Developer" },
      type: "job/updateAddJobFormData",
    });
  });

  it("handles job code input change", () => {
    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    const jobCodeInput = screen.getByLabelText(/Job Code/i);
    fireEvent.change(jobCodeInput, { target: { value: "FE-123" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { jobCode: "FE-123" },
      type: "job/updateAddJobFormData",
    });
  });

  it("handles job status radio button selection", () => {
    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    const activeRadio = screen.getByLabelText("Active");
    fireEvent.click(activeRadio);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { isJobActive: "Active" },
      type: "job/updateAddJobFormData",
    });
  });

  it("displays error messages when fields have errors", () => {
    // Mock useField to return an error for jobTitle
    (useField as ReturnType<typeof vi.fn>).mockImplementationOnce(() => [
      {
        name: "jobTitle",
        value: "",
        onChange: vi.fn(),
        onBlur: vi.fn(),
      },
      {
        touched: true,
        error: "Job title is required",
      },
    ]);

    render(
      <Provider store={mockStore}>
        <Step1BasicDetails User={mockUser} />
      </Provider>
    );

    expect(screen.getByText("Job title is required")).toBeInTheDocument();
  });
});