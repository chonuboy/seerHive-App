interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  steps: string[]
}

export default function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-12">
      <div className="flex items-center">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber <= currentStep
          const isCurrent = stepNumber === currentStep
          return (
            <div key={stepNumber} className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="relative group">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg transition-all duration-300 ${
                      isCurrent
                        ? "bg-cyan-500 border-2 border-cyan-600 text-white scale-110"
                        : isActive
                          ? "bg-cyan-500 border-2 border-cyan-600 text-white"
                          : "bg-white border-2 border-gray-500 text-gray-600"
                    } hover:scale-110 hover:shadow-lg`}
                  >
                    {stepNumber}
                  </div>
                  {/* <div className="absolute bottom-full left-1/2 -translate-x-1/2 transform mb-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <div className="bg-cyan-500 text-white text-sm rounded py-1 px-2">{steps[stepNumber - 1]}</div>
                  </div> */}
                  {/* Step description moved here, positioned absolutely below the circle */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-sm font-semibold text-gray-700 text-center w-max max-w-[100px]">
                    {steps[stepNumber - 1]}
                  </div>
                </div>
                {stepNumber < totalSteps && (
                  <div
                    className={`w-24 h-1 mx-2 transition-all duration-500 ${
                      stepNumber < currentStep ? "bg-cyan-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
