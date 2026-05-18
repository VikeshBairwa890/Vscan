import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import questions from "./questions";
import servicesByCategory from "./services";

import AssistantHeader from "./AssistantHeader";
import ProgressBar from "./ProgressBar";
import QuestionCard from "./QuestionCard";
import OptionCard from "./OptionCard";
import ServiceChip from "./ServiceChip";

const STORAGE_KEY = "vscan-onboarding";

export default function ChatbotOverlay() {
  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<any>(
    {}
  );

  const [input, setInput] = useState("");

  const [otherInput, setOtherInput] =
    useState("");

  const [showOtherInput, setShowOtherInput] =
    useState(false);

  const [isLoaded, setIsLoaded] =
    useState(false);

  const currentQuestion = questions[step];

  const isCompleted =
    step >= questions.length;

  const selectedServices = useMemo(() => {
    return answers.services || [];
  }, [answers]);

  const dynamicServices =
    servicesByCategory[
      answers.category as keyof typeof servicesByCategory
    ] || [];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        step,
        answers,
      })
    );
  }, [step, answers, isLoaded]);

  useEffect(() => {
    setOtherInput("");
    setShowOtherInput(false);
  }, [step]);

  const handleNext = (value: any) => {
    if (!currentQuestion) return;

    setAnswers((prev: any) => ({
      ...prev,
      [currentQuestion.key]: value,
    }));

    setInput("");

    setTimeout(() => {
      setStep((prev) => prev + 1);
    }, 200);
  };

  const handleServiceToggle = (
    service: string
  ) => {
    if (service === "Other") {
      setShowOtherInput(true);
      return;
    }

    const current = selectedServices;

    if (current.includes(service)) {
      setAnswers((prev: any) => ({
        ...prev,
        services: current.filter(
          (item: string) => item !== service
        ),
      }));
    } else {
      setAnswers((prev: any) => ({
        ...prev,
        services: [...current, service],
      }));
    }
  };

  const handleAddOtherService = () => {
    if (!otherInput.trim()) return;

    setAnswers((prev: any) => ({
      ...prev,
      services: [
        ...selectedServices,
        otherInput,
      ],
    }));

    setOtherInput("");
    setShowOtherInput(false);
  };

  const handleComplete = () => {
    localStorage.setItem(
      "onboardingCompleted",
      "true"
    );

    console.log(
      "FINAL ONBOARDING DATA:",
      answers
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.98,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.3,
        }}
        className="mx-auto flex h-[95vh] w-full max-w-6xl flex-col overflow-hidden rounded-[36px] border border-zinc-200 bg-white shadow-[0_20px_80px_rgba(0,0,0,0.08)]"
      >
        {/* Header */}
        <AssistantHeader />

        {/* Main */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {!isCompleted ? (
            <div className="flex min-h-0 flex-1 flex-col">
              {/* Progress */}
              {currentQuestion.type !==
                "welcome" && (
                <div className="border-b border-zinc-100 px-6 py-5 md:px-10">
                  <ProgressBar
                    current={step - 1}
                    total={
                      questions.length - 1
                    }
                  />
                </div>
              )}

              {/* Scroll Area */}
              <div className="flex min-h-0 flex-1 overflow-y-auto">
                <div className="mx-auto w-full max-w-5xl px-6 py-10 md:px-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -20,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className="w-full"
                    >
                      {/* WELCOME */}
                      {currentQuestion.type ===
                        "welcome" && (
                        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
                          <motion.div
                            initial={{
                              scale: 0.8,
                              opacity: 0,
                            }}
                            animate={{
                              scale: 1,
                              opacity: 1,
                            }}
                            transition={{
                              delay: 0.1,
                            }}
                            className="mb-8 flex h-32 w-32 items-center justify-center rounded-[40px] bg-gradient-to-br from-violet-500 to-indigo-500 text-6xl text-white shadow-2xl"
                          >
                            ✨
                          </motion.div>

                          <h1 className="mb-5 text-5xl font-bold tracking-tight text-zinc-900">
                            Welcome to Vscan AI
                          </h1>

                          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-500">
                            We’ll help you setup your
                            business profile in less
                            than 2 minutes.
                          </p>

                          <button
                            onClick={() =>
                              setStep(
                                (prev) =>
                                  prev + 1
                              )
                            }
                            className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
                          >
                            Start Setup
                          </button>
                        </div>
                      )}

                      {/* QUESTIONS */}
                      {currentQuestion.type !==
                        "welcome" && (
                        <>
                          {/* Back */}
                          <button
                            onClick={() =>
                              setStep((prev) =>
                                Math.max(
                                  prev - 1,
                                  0
                                )
                              )
                            }
                            className="mb-6 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
                          >
                            ← Back
                          </button>

                          {/* Question */}
                          <QuestionCard
                            question={
                              currentQuestion.question
                            }
                          />

                          {/* TEXT */}
                          {currentQuestion.type ===
                            "text" && (
                            <div className="space-y-5">
                              <input
                                type="text"
                                value={input}
                                onChange={(e) =>
                                  setInput(
                                    e.target.value
                                  )
                                }
                                placeholder="Type here..."
                                className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg text-zinc-900 outline-none transition-all duration-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                              />

                              <div className="flex items-center gap-3">
                                {currentQuestion.optional && (
                                  <button
                                    onClick={() =>
                                      handleNext("")
                                    }
                                    className="rounded-2xl border border-zinc-200 px-6 py-4 font-medium text-zinc-600 transition hover:bg-zinc-100"
                                  >
                                    Skip
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    input.trim() &&
                                    handleNext(
                                      input
                                    )
                                  }
                                  className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.01]"
                                >
                                  Continue
                                </button>
                              </div>
                            </div>
                          )}

                          {/* SINGLE SELECT */}
                          {currentQuestion.type ===
                            "single-select" && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                {currentQuestion.options.map(
                                  (
                                    option: any
                                  ) => (
                                    <OptionCard
                                      key={
                                        option.value
                                      }
                                      label={
                                        option.label
                                      }
                                      description={
                                        option.description
                                      }
                                      icon={
                                        option.icon
                                      }
                                      selected={
                                        answers[
                                          currentQuestion
                                            .key
                                        ] ===
                                        option.value
                                      }
                                      onClick={() => {
                                        if (
                                          option.value ===
                                          "Other"
                                        ) {
                                          setShowOtherInput(
                                            true
                                          );

                                          return;
                                        }

                                        handleNext(
                                          option.value
                                        );
                                      }}
                                    />
                                  )
                                )}
                              </div>

                              {showOtherInput && (
                                <div className="space-y-4">
                                  <input
                                    type="text"
                                    value={
                                      otherInput
                                    }
                                    onChange={(e) =>
                                      setOtherInput(
                                        e.target
                                          .value
                                      )
                                    }
                                    placeholder="Enter your business category..."
                                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                  />

                                  <button
                                    onClick={() =>
                                      otherInput.trim() &&
                                      handleNext(
                                        otherInput
                                      )
                                    }
                                    className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-medium text-white"
                                  >
                                    Continue
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* MULTI SELECT */}
                          {currentQuestion.type ===
                            "multi-select" && (
                            <div>
                              <div className="mb-8 flex flex-wrap gap-3">
                                {dynamicServices.map(
                                  (
                                    option: string
                                  ) => (
                                    <ServiceChip
                                      key={
                                        option
                                      }
                                      label={
                                        option
                                      }
                                      selected={selectedServices.includes(
                                        option
                                      )}
                                      onClick={() =>
                                        handleServiceToggle(
                                          option
                                        )
                                      }
                                    />
                                  )
                                )}
                              </div>

                              {showOtherInput && (
                                <div className="mb-6 space-y-4">
                                  <input
                                    type="text"
                                    value={
                                      otherInput
                                    }
                                    onChange={(e) =>
                                      setOtherInput(
                                        e.target
                                          .value
                                      )
                                    }
                                    placeholder="Add custom service..."
                                    className="w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 text-lg outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                  />

                                  <button
                                    onClick={
                                      handleAddOtherService
                                    }
                                    className="rounded-2xl bg-zinc-900 px-5 py-3 font-medium text-white"
                                  >
                                    Add Service
                                  </button>
                                </div>
                              )}

                              <button
                                onClick={() =>
                                  handleNext(
                                    selectedServices
                                  )
                                }
                                className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.01]"
                              >
                                Continue
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 py-10">
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="w-full max-w-2xl rounded-[32px] border border-zinc-200 bg-white p-10 shadow-xl"
              >
                <div className="mb-8 text-center">
                  <div className="mb-5 text-6xl">
                    🎉
                  </div>

                  <h2 className="text-4xl font-bold text-zinc-900">
                    Business Setup Complete
                  </h2>

                  <p className="mt-3 text-zinc-500">
                    Your business profile has
                    been created successfully.
                  </p>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.01]"
                >
                  Continue To Dashboard
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}