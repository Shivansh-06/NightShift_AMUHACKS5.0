import { motion } from "framer-motion";

export default function StepProgress({ currentStep }) {
  const steps = [
    "Select Career",
    "Take Assessment",
    "Skill DNA"
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between relative">

        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-col items-center flex-1 relative">

              {/* Line */}
              {index !== 0 && (
                <div className="absolute left-0 top-4 w-full h-1 -z-10">
                  <div
                    className={`h-1 transition-all duration-500 ${
                      isCompleted ? "bg-blue-500" : "bg-gray-700"
                    }`}
                  />
                </div>
              )}

              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isActive ? 1.2 : 1 }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold ${
                  isCompleted
                    ? "bg-blue-600 text-white"
                    : isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {stepNumber}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-sm ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
