// tests/components/forms/Step2Preferences.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Step2Preferences from "@/components/Forms/jobs/Addjobsteps/Addjob-2";
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
        experience: "",
        salaryInCtc: "",
        jobPostType: "",
      },
    }) => state,
  },
});

describe("Step2Preferences Component", () => {
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
      {
        setValue: vi.fn(),
      },
    ]);
  });

  it("renders all sections and input fields", () => {
    render(
      <Provider store={mockStore}>
        <Step2Preferences />
      </Provider>
    );

    expect(screen.getByText("Preferences")).toBeInTheDocument();
    
    // Experience field
    expect(screen.getByLabelText(/Experience \(years\)/i)).toBeInTheDocument();
    
    // Salary field
    expect(screen.getByLabelText(/Salary Range \(LPA\)/i)).toBeInTheDocument();
    
    // Job Type radio buttons
    expect(screen.getByText(/Job Type/i)).toBeInTheDocument();
    expect(screen.getByText("Full Time")).toBeInTheDocument();
    expect(screen.getByText("Part Time")).toBeInTheDocument();
    expect(screen.getByText("Contract")).toBeInTheDocument();
  });

  it("handles experience input change", () => {
    render(
      <Provider store={mockStore}>
        <Step2Preferences />
      </Provider>
    );

    const experienceInput = screen.getByLabelText(/Experience \(years\)/i);
    fireEvent.change(experienceInput, { target: { value: "5" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { experience: "5" },
      type: "job/updateAddJobFormData",
    });
  });

  it("handles salary input change", () => {
    render(
      <Provider store={mockStore}>
        <Step2Preferences />
      </Provider>
    );

    const salaryInput = screen.getByLabelText(/Salary Range \(LPA\)/i);
    fireEvent.change(salaryInput, { target: { value: "15" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { salaryInCtc: "15" },
      type: "job/updateAddJobFormData",
    });
  });

  it("handles job type radio button selection", () => {
    // Mock the setValue helper for jobType
    const mockSetValue = vi.fn();
    (useField as ReturnType<typeof vi.fn>).mockImplementationOnce(() => [
      { name: "jobPostType", value: "", onChange: vi.fn(), onBlur: vi.fn() },
      { touched: false, error: "" },
      { setValue: mockSetValue },
    ]);

    render(
      <Provider store={mockStore}>
        <Step2Preferences />
      </Provider>
    );

    const contractRadio = screen.getByText("Contract").closest("label")?.querySelector("input");
    if (contractRadio) {
      fireEvent.click(contractRadio);
    }

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: { jobPostType: "Contract" },
      type: "job/updateAddJobFormData",
    });
  });

  it("displays error messages when fields have errors", () => {
    // Mock useField to return errors for all fields
    (useField as ReturnType<typeof vi.fn>)
      .mockImplementationOnce(() => [
        {
          name: "experience",
          value: "",
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
        {
          touched: true,
          error: "Experience is required",
        },
        { setValue: vi.fn() },
      ])
      .mockImplementationOnce(() => [
        {
          name: "salaryInCtc",
          value: "",
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
        {
          touched: true,
          error: "Salary is required",
        },
        { setValue: vi.fn() },
      ])
      .mockImplementationOnce(() => [
        {
          name: "jobPostType",
          value: "",
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
        {
          touched: true,
          error: "Job type is required",
        },
        { setValue: vi.fn() },
      ]);

    render(
      <Provider store={mockStore}>
        <Step2Preferences />
      </Provider>
    );

    expect(screen.getByText("Experience is required")).toBeInTheDocument();
    expect(screen.getByText("Salary is required")).toBeInTheDocument();
    expect(screen.getByText("Job type is required")).toBeInTheDocument();
  });

  it("shows visual feedback for selected job type", () => {
    // Mock store with selected job type
    const storeWithSelectedType = configureStore({
      reducer: {
        job: (state = {
          formData: {
            experience: "",
            salaryInCtc: "",
            jobPostType: "Full Time",
          },
        }) => state,
      },
    });

    render(
      <Provider store={storeWithSelectedType}>
        <Step2Preferences />
      </Provider>
    );

    // Get the radio button visual indicator for Full Time
    const fullTimeIndicator = screen
      .getByText("Full Time")
      .closest("label")
      ?.querySelector("[class*='bg-cyan-500']");
    
    expect(fullTimeIndicator).toBeInTheDocument();
  });
});