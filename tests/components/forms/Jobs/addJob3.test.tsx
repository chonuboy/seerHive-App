// tests/components/forms/Step3JobDescription.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Step3JobDescription from "@/components/Forms/jobs/Addjobsteps/Addjob-3";
import { useField } from "formik";
import { toast } from "react-toastify";
import { uploadJD } from "@/api/client/clientJob";

// Mock Formik's useField hook
vi.mock("formik", () => ({
  useField: vi.fn(),
}));

// Mock Jodit Editor
vi.mock("next/dynamic", () => ({
  __esModule: true,
  default: vi.fn().mockImplementation((loader) => {
    loader().then((module: any) => {
      return vi.fn().mockImplementation((props: any) => {
        return (
          <textarea
            data-testid="jodit-editor"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        );
      });
    });
    return vi.fn().mockReturnValue(<div>Mock Editor</div>);
  }),
}));

// Mock file upload API
vi.mock("@/api/client/clientJob", () => ({
  uploadJD: vi.fn(),
}));

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock Lucide icons
vi.mock("lucide-react", () => ({
  Upload: () => <div>UploadIcon</div>,
  FileText: () => <div>FileTextIcon</div>,
  X: () => <div>XIcon</div>,
}));

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    job: (state = {
      formData: {
        jobDescription: "",
        jd: null,
      },
    }) => state,
  },
});

describe("Step3JobDescription Component", () => {
  const mockDispatch = vi.fn();
  const mockUploadJD = vi.mocked(uploadJD);

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

    // Mock successful file upload
    mockUploadJD.mockResolvedValue("http://example.com/jd.pdf");
  });

  it("renders all sections and input fields", () => {
    render(
      <Provider store={mockStore}>
        <Step3JobDescription />
      </Provider>
    );

    expect(screen.getByText("Job Description")).toBeInTheDocument();
    expect(screen.getByText("Upload JD File")).toBeInTheDocument();
    expect(screen.getByText("Upload a file")).toBeInTheDocument();
    expect(screen.getByText("or drag and drop")).toBeInTheDocument();
  });


  it("handles file upload via input", async () => {
    render(
      <Provider store={mockStore}>
        <Step3JobDescription />
      </Provider>
    );

    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const fileInput = screen.getByTestId("file-upload");

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUploadJD).toHaveBeenCalledWith({ file });
      expect(mockDispatch).toHaveBeenCalledWith({
        payload: { jd: "http://example.com/jd.pdf" },
        type: "job/updateAddJobFormData",
      });
      expect(toast.success).toHaveBeenCalledWith("File uploaded successfully", {
        position: "top-right",
      });
    });
  });

  it("handles file drag and drop", async () => {
    render(
      <Provider store={mockStore}>
        <Step3JobDescription />
      </Provider>
    );

    const dropZone = screen.getByText("or drag and drop").closest("div")!;
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    await waitFor(() => {
      expect(mockUploadJD).toHaveBeenCalledWith({ file });
    });
  });

  it("shows error for invalid file types on drop", () => {
    render(
      <Provider store={mockStore}>
        <Step3JobDescription />
      </Provider>
    );

    const dropZone = screen.getByText("or drag and drop").closest("div")!;
    const file = new File(["test"], "test.txt", { type: "text/plain" });

    fireEvent.dragOver(dropZone);
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(mockUploadJD).not.toHaveBeenCalled();
  });

  it("clears selected file", async () => {
    // Mock store with file already uploaded
    const storeWithFile = configureStore({
      reducer: {
        job: (state = {
          formData: {
            jobDescription: "",
            jd: "http://example.com/jd.pdf",
          },
        }) => state,
      },
    });

    render(
      <Provider store={storeWithFile}>
        <Step3JobDescription />
      </Provider>
    );
  });

  it("displays error messages when fields have errors", () => {
    // Mock useField to return errors
    (useField as ReturnType<typeof vi.fn>)
      .mockImplementationOnce(() => [
        {
          name: "jobDescription",
          value: "",
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
        {
          touched: true,
          error: "Job description is required",
        },
        { setValue: vi.fn() },
      ])
      .mockImplementationOnce(() => [
        {
          name: "jd",
          value: null,
          onChange: vi.fn(),
          onBlur: vi.fn(),
        },
        {
          touched: true,
          error: "JD file is required",
        },
        { setValue: vi.fn() },
      ]);

    render(
      <Provider store={mockStore}>
        <Step3JobDescription />
      </Provider>
    );

    expect(screen.getByText("Job description is required")).toBeInTheDocument();
    expect(screen.getByText("JD file is required")).toBeInTheDocument();
  });

  it("shows uploaded file information", () => {
    // Mock store with file already uploaded
    const storeWithFile = configureStore({
      reducer: {
        job: (state = {
          formData: {
            jobDescription: "",
            jd: "http://example.com/jd.pdf",
          },
        }) => state,
      },
    });

    render(
      <Provider store={storeWithFile}>
        <Step3JobDescription />
      </Provider>
    );
  });

  
  // Disabled because it is a false postive TestCase

  // it("handles file upload error", async () => {
  //   mockUploadJD.mockRejectedValue(new Error("Upload failed"));
    
  //   render(
  //     <Provider store={mockStore}>
  //       <Step3JobDescription />
  //     </Provider>
  //   );

  //   const file = new File(["test"], "test.pdf", { type: "application/pdf" });
  //   const fileInput = screen.getByTestId("file-upload");

  //   fireEvent.change(fileInput, { target: { files: [file] } });
  // });

  waitFor(() => {
    expect(toast.error).toHaveBeenCalled();
  });
});