import React, { useEffect, useState, useRef } from 'react';
import {
  ArrowRight,
  Check,
  TrendingUp,
  ArrowRightCircle,
  ShieldCheck,
  Activity,
} from 'lucide-react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';

const steps = [
  {
    date: 'Jul 4',
    label: 'Evaluation purchased',
    value: '$449',
    meta: '$100K 2-Step Challenge',
  },
  {
    date: 'Jul 4',
    label: 'Phase 1 passed',
    value: 'Same day',
    meta: 'Cleared',
    done: true,
  },
  {
    date: 'Jul 9',
    label: 'Phase 2 passed',
    sub: '5 days after Phase 1',
    value: 'Funded',
    meta: 'Master account funded',
    done: true,
  },
  {
    date: 'Jul 21',
    label: 'First payout',
    sub: '14 days after funded',
    value: '$6,050.90',
    meta: 'Paid out in 4 hrs',
    active: true,
  },
];

const activity = [
  { text: 'Trader •••482 passed Phase 1', time: '2m ago' },
  { text: 'Trader •••719 got funded', time: '6m ago' },
  { text: 'Trader •••203 received a $1,840 payout', time: '11m ago' },
  { text: 'Trader •••055 started a $50K evaluation', time: '14m ago' },
  { text: 'Trader •••866 passed Phase 2', time: '19m ago' },
];

const ease = [0.22, 1, 0.36, 1];

function Dot({ step, index, isInView }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{
        delay: index * 0.18,
        duration: 0.45,
        ease,
      }}
      className="relative shrink-0"
    >
      {/* Active payout pulse */}
      {step.active && isInView && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            initial={{ scale: 1, opacity: 0 }}
            animate={{
              scale: [1, 1.9, 1.9],
              opacity: [0.5, 0, 0],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 1.1,
            }}
          />

          <motion.div
            className="absolute inset-0 rounded-full bg-white/5"
            animate={{
              scale: [1, 1.35, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 2.6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      <div
        className={`relative w-[22px] h-[22px] rounded-full border flex items-center justify-center bg-[#05060A] ${
          step.active
            ? 'border-white'
            : step.done
              ? 'border-white/40'
              : 'border-white/20'
        }`}
      >
        {step.done || step.active ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{
              delay: index * 0.18 + 0.18,
              duration: 0.3,
              ease,
            }}
          >
            <Check
              className="w-3 h-3 text-white"
              strokeWidth={2.5}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{
              delay: index * 0.18 + 0.15,
              duration: 0.25,
            }}
            className="w-1.5 h-1.5 rounded-full bg-white/50"
          />
        )}
      </div>
    </motion.div>
  );
}

function TimelineConnector({ index, isInView }) {
  return (
    <div className="flex-1 h-px bg-white/10 ml-3 overflow-hidden">
      <motion.div
        className="h-full bg-white/35 origin-left"
        initial={{ scaleX: 0 }}
        animate={isInView ? { scaleX: 1 } : {}}
        transition={{
          delay: index * 0.18 + 0.3,
          duration: 0.55,
          ease,
        }}
      />
    </div>
  );
}

function AnimatedNumber({ isInView }) {
  const count = useMotionValue(0);

  const spring = useSpring(count, {
    stiffness: 70,
    damping: 20,
    mass: 0.8,
  });

  const rounded = useTransform(spring, (value) =>
    Math.round(value * 100) / 100
  );

  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    count.set(1247.99);

    const unsubscribe = rounded.on('change', (latest) => {
      setDisplay(
        latest.toLocaleString(undefined, {
          minimumFractionDigits: latest >= 1000 ? 2 : 0,
          maximumFractionDigits: 2,
        })
      );
    });

    return unsubscribe;
  }, [isInView, count, rounded]);

  return <>{display}</>;
}

const AcgJourney = () => {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0.3,
  });

  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const update = () => setReduceMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.('change', update);

    return () => {
      mediaQuery.removeEventListener?.('change', update);
    };
  }, []);

  const shouldAnimate = isInView && !reduceMotion;

  return (
    <div
      ref={sectionRef}
      className="w-full flex flex-col gap-6 text-white font-sans"
    >
      {/* --- HEADER & ACTIVITY FEED --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={
            isInView || reduceMotion
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.7,
            ease,
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white mb-2">
            A funded trader's journey
          </h2>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Case study</span>
            <span className="text-gray-700">/</span>
            <span>Jul 4 – Jul 21</span>
            <span className="text-gray-700">/</span>
            <span>$100K 2-Step Challenge</span>
          </div>
        </motion.div>

        {/* Activity feed */}
        <motion.div
          initial={{
            opacity: 0,
            x: 20,
          }}
          animate={
            isInView || reduceMotion
              ? {
                  opacity: 1,
                  x: 0,
                }
              : {}
          }
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease,
          }}
          className="bg-[#0A0C12] border border-white/10 rounded-lg px-4 py-3.5 w-full max-w-sm overflow-hidden"
        >
          <div className="flex items-center gap-1.5 mb-2.5 text-xs text-gray-500">
            <Activity className="w-3 h-3 text-white/70" />
            <span>Recent activity</span>
          </div>

          <div className="h-[52px] overflow-hidden relative">
            <div className="flex flex-col">
              {activity.slice(0, 2).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={
                    isInView || reduceMotion
                      ? {
                          opacity: 1,
                          y: 0,
                        }
                      : {}
                  }
                  transition={{
                    delay: 0.65 + i * 0.12,
                    duration: 0.45,
                    ease,
                  }}
                  className="flex items-center justify-between gap-3 h-[26px] text-xs shrink-0"
                >
                  <span className="text-gray-400 truncate">
                    {item.text}
                  </span>

                  <span className="text-gray-600 shrink-0">
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Timeline */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={
            isInView || reduceMotion
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.7,
            delay: 0.15,
            ease,
          }}
          className="flex-1 bg-[#0A0C12] border border-white/10 rounded-lg p-6 sm:p-8"
        >

          {/* Desktop */}
          <div className="hidden md:grid grid-cols-4">
            {steps.map((step, i) => (
              <div
                key={step.label}
                className={`flex flex-col ${
                  i !== steps.length - 1 ? 'pr-6' : ''
                } ${i !== 0 ? 'pl-6' : ''}`}
              >

                {/* Dot + connector */}
                <div className="flex items-center mb-6">
                  <Dot
                    step={step}
                    index={i}
                    isInView={shouldAnimate || reduceMotion}
                  />

                  <motion.span
                    initial={{
                      opacity: 0,
                      x: -5,
                    }}
                    animate={
                      isInView || reduceMotion
                        ? {
                            opacity: 1,
                            x: 0,
                          }
                        : {}
                    }
                    transition={{
                      delay: i * 0.18 + 0.2,
                      duration: 0.4,
                      ease,
                    }}
                    className={`ml-2.5 text-xs shrink-0 ${
                      step.active
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.date}
                  </motion.span>

                  {i !== steps.length - 1 && (
                    <TimelineConnector
                      index={i}
                      isInView={shouldAnimate || reduceMotion}
                    />
                  )}
                </div>

                {/* Label */}
                <motion.h4
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={
                    isInView || reduceMotion
                      ? {
                          opacity: 1,
                          y: 0,
                        }
                      : {}
                  }
                  transition={{
                    delay: i * 0.18 + 0.35,
                    duration: 0.5,
                    ease,
                  }}
                  className="text-sm text-gray-300 mb-5 leading-snug"
                >
                  {step.label}

                  {step.sub && (
                    <span className="block text-xs text-gray-600 mt-0.5">
                      {step.sub}
                    </span>
                  )}
                </motion.h4>

                {/* Value */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={
                    isInView || reduceMotion
                      ? {
                          opacity: 1,
                          y: 0,
                        }
                      : {}
                  }
                  transition={{
                    delay: i * 0.18 + 0.45,
                    duration: 0.5,
                    ease,
                  }}
                >
                  <div
                    className={`text-2xl font-medium tracking-tight ${
                      step.active
                        ? 'text-white'
                        : 'text-white'
                    }`}
                  >
                    {step.value}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {step.meta}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden flex-col divide-y divide-white/10">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{
                  opacity: 0,
                  x: -12,
                }}
                animate={
                  isInView || reduceMotion
                    ? {
                        opacity: 1,
                        x: 0,
                      }
                    : {}
                }
                transition={{
                  delay: i * 0.14,
                  duration: 0.5,
                  ease,
                }}
                className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
              >
                <Dot
                  step={step}
                  index={i}
                  isInView={shouldAnimate || reduceMotion}
                />

                <div className="flex-1 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm text-gray-300">
                      {step.label}
                    </h4>

                    <div className="text-xs text-gray-600 mt-0.5">
                      {step.sub || step.date}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-base font-medium text-white">
                      {step.value}
                    </div>

                    <div className="text-xs text-gray-500">
                      {step.meta}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Panel */}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.97,
            y: 20,
          }}
          animate={
            isInView || reduceMotion
              ? {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.75,
            delay: 0.35,
            ease,
          }}
          className="w-full lg:w-[300px] rounded-lg bg-[#0A0C12] border border-white/10 p-7 flex flex-col justify-center items-center text-center"
        >

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={
              isInView || reduceMotion
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              delay: 0.65,
              duration: 0.45,
              ease,
            }}
            className="inline-flex items-center gap-1.5 text-gray-500 text-xs mb-7"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>first payout and counting</span>
          </motion.div>

          {/* Animated percentage */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
            }}
            animate={
              isInView || reduceMotion
                ? {
                    opacity: 1,
                    scale: 1,
                  }
                : {}
            }
            transition={{
              delay: 0.55,
              duration: 0.65,
              ease,
            }}
            className="text-5xl font-medium text-white tracking-tight mb-2 leading-none tabular-nums"
          >
            {reduceMotion ? '1,247.99' : <AnimatedNumber isInView={isInView} />}
            <span className="text-gray-600">%</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={
              isInView || reduceMotion
                ? { opacity: 1 }
                : {}
            }
            transition={{
              delay: 0.8,
              duration: 0.4,
            }}
            className="text-xs text-gray-600 leading-relaxed mb-6"
          >
            Return on evaluation fee
            <br />
            in this case study
          </motion.p>

          {/* Money flow */}
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={
              isInView || reduceMotion
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              delay: 0.9,
              duration: 0.5,
              ease,
            }}
            className="flex items-center justify-center gap-2.5 text-gray-500 text-sm mb-6 px-3 py-1.5 rounded-md border border-white/10"
          >
            <span>$449</span>

            <div className="relative flex items-center justify-center">
              <ArrowRightCircle className="w-3.5 h-3.5 text-gray-600" />

              {isInView && !reduceMotion && (
                <motion.div
                  className="absolute w-1 h-1 rounded-full bg-white"
                  initial={{
                    x: -7,
                    opacity: 0,
                  }}
                  animate={{
                    x: 7,
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>

            <motion.span
              initial={{ opacity: 0.4 }}
              animate={
                isInView || reduceMotion
                  ? {
                      opacity: [0.4, 1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                delay: 1.15,
                duration: 1.2,
                ease: 'easeInOut',
              }}
              className="text-gray-200"
            >
              $6050
            </motion.span>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={
              isInView || reduceMotion
                ? {
                    opacity: 1,
                    y: 0,
                  }
                : {}
            }
            transition={{
              delay: 1.05,
              duration: 0.5,
              ease,
            }}
            whileHover={
              reduceMotion
                ? {}
                : {
                    scale: 1.015,
                  }
            }
            whileTap={
              reduceMotion
                ? {}
                : {
                    scale: 0.985,
                  }
            }
            className="w-full h-10 rounded-md bg-white text-[#05060A] font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-1.5"
          >
            Start Your Challenge

            <motion.div
              animate={
                isInView && !reduceMotion
                  ? {
                      x: [0, 3, 0],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight
                className="w-4 h-4"
                strokeWidth={2}
              />
            </motion.div>
          </motion.button>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={
              isInView || reduceMotion
                ? { opacity: 1 }
                : {}
            }
            transition={{
              delay: 1.25,
              duration: 0.4,
            }}
            className="flex items-center gap-1.5 text-[11px] text-gray-600 mt-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Results reflect one trader's account</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AcgJourney;
