"use client";

import React from "react";
import { Play, BookOpen, Users, Clock, Star, Award, Rocket, Moon, Globe } from "lucide-react";
import Link from "next/link";
import SyllabusAccordion from "./SyllabusAccordion";

const ICON_MAP = {
  BookOpen,
  Users,
  Clock,
  Star,
  Award,
  Rocket,
  Moon,
  Globe,
};

type IconName = keyof typeof ICON_MAP;

interface AITeacher {
  name: string;
  nickname: string;
  avatar: string;
  specialty: string;
  bio: string;
  stats: { label: string; value: string }[];
}

interface SyllabusLesson {
  week: string;
  title: string;
  topics: string[];
}

interface CourseDetailProps {
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  description: string;
  accentColor: string;
  heroGradient: string;
  stats: { icon: IconName; label: string; value: string }[];
  teacher: AITeacher;
  syllabus: SyllabusLesson[];
  outcomes: string[];
  previewTitle: string;
  videoSrc?: string;
}

export default function CourseDetailTemplate({
  badge,
  badgeColor,
  title,
  tagline,
  description,
  accentColor,
  heroGradient,
  stats,
  teacher,
  syllabus,
  outcomes,
  previewTitle,
  videoSrc,
}: CourseDetailProps) {
  return (
    <div>
      {/* ── Hero Banner ── */}
      <section
        className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ background: heroGradient }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-10">
            <div className="flex-1">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block"
                style={{
                  background: `${badgeColor}33`,
                  color: badgeColor,
                  border: `1px solid ${badgeColor}55`,
                }}
              >
                {badge}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
                {title}
              </h1>
              <p
                className="text-lg font-semibold mb-4"
                style={{ color: accentColor }}
              >
                {tagline}
              </p>
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
                {description}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-5 mb-8">
                {stats.map((s) => {
                  const Icon = ICON_MAP[s.icon] || Star;
                  return (
                    <div key={s.label} className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color: accentColor }} />
                      <span className="text-white/70 text-sm">
                        <strong className="text-white">{s.value}</strong> {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/orbit-academy#pricing">
                  <button className="orbit-btn-primary">
                    Join This Course 🚀
                  </button>
                </Link>
                <button className="orbit-btn-secondary flex items-center gap-2">
                  <Play className="w-4 h-4 fill-current" />
                  Free Preview Lesson
                </button>
              </div>
            </div>

            {/* Hero visual */}
            <div className="lg:w-[420px] shrink-0">
              <div
                className="rounded-2xl overflow-hidden border aspect-[4/3] flex items-center justify-center relative"
                style={{ borderColor: `${accentColor}30` }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${accentColor}10, rgba(10,6,18,0.7))`,
                  }}
                />
                <div className="text-center z-10 relative p-6">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{
                      background: `${accentColor}20`,
                      border: `2px solid ${accentColor}40`,
                    }}
                  >
                    <Play className="w-7 h-7 fill-current" style={{ color: accentColor }} />
                  </div>
                  <p className="text-white/50 text-sm font-medium">
                    {previewTitle}
                  </p>
                  <p className="text-white/25 text-xs mt-1">
                    Golden Hour lifestyle visual · Placeholder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Syllabus + Video Preview */}
          <div className="lg:col-span-2 space-y-10">
            {/* Curriculum Preview */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" style={{ color: accentColor }} />
                Curriculum Preview
              </h2>
              <p className="text-white/45 text-sm mb-5">
                Watch a sample lesson before you commit. No sign-up required.
              </p>
              <div className="video-placeholder group relative overflow-hidden bg-[#0a0612] rounded-[0.875rem] min-h-[300px] flex items-center justify-center border border-white/5">
                {videoSrc ? (
                  <video 
                    src={videoSrc} 
                    controls 
                    className="absolute inset-0 w-full h-full object-cover"
                    poster="/auth-bg.png"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 rounded-[0.875rem]"
                      style={{
                        background: `radial-gradient(circle at 50% 40%, ${accentColor}08 0%, transparent 70%)`,
                      }} />
                    <div className="relative z-10 text-center">
                      <div
                        className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{
                          background: `${accentColor}25`,
                          border: `2px solid ${accentColor}50`,
                          boxShadow: `0 0 30px ${accentColor}30`,
                        }}
                      >
                        <Play className="w-9 h-9 fill-current ml-1" style={{ color: accentColor }} />
                      </div>
                      <p className="text-white/60 font-semibold">
                        Watch: Introduction to {title}
                      </p>
                      <p className="text-white/30 text-sm mt-1">
                        12 min · HD · Subtitle options available
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Syllabus Accordion */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: accentColor }} />
                Full Syllabus
              </h2>
              <p className="text-white/45 text-sm mb-5">
                A structured, week-by-week journey crafted by space educators and
                STEM curriculum designers.
              </p>
              <SyllabusAccordion items={syllabus} />
            </div>

            {/* Learning outcomes */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5" style={{ color: accentColor }} />
                What Your Child Will Master
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {outcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 rounded-xl"
                    style={{ background: `${accentColor}08`, border: `1px solid ${accentColor}20` }}
                  >
                    <span
                      className="text-sm font-bold shrink-0 w-6 h-6 flex items-center justify-center rounded-full"
                      style={{ background: `${accentColor}25`, color: accentColor }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-sm text-white/70 leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: AI Teacher + Enrollment card */}
          <div className="space-y-7">
            {/* AI Teacher profile */}
            <div className="glass-card p-7">
              <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Meet Your AI Teacher
              </h3>

              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-3 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
                    border: `2px solid ${accentColor}40`,
                  }}
                >
                  {teacher.avatar.startsWith("/") || teacher.avatar.startsWith("http") ? (
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    teacher.avatar
                  )}
                </div>
                <h4 className="text-lg font-extrabold text-white">
                  {teacher.name}
                </h4>
                <p className="text-sm font-semibold" style={{ color: accentColor }}>
                  {teacher.nickname}
                </p>
              </div>

              <p className="text-white/40 text-xs uppercase tracking-widest font-bold mb-1">
                Specialty
              </p>
              <p className="text-white/70 text-sm mb-4">{teacher.specialty}</p>
              <p className="text-white/55 text-sm leading-relaxed mb-5">
                {teacher.bio}
              </p>

              {/* Teacher stats */}
              <div className="grid grid-cols-3 gap-3">
                {teacher.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center p-2 rounded-xl"
                    style={{ background: `${accentColor}0d` }}
                  >
                    <div
                      className="text-lg font-extrabold"
                      style={{ color: accentColor }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-white/40 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enrollment sticky card */}
            <div
              className="glass-card p-7 sticky top-20"
              style={{ borderColor: `${accentColor}30` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" style={{ color: accentColor }} />
                <span className="text-sm text-white/60">Limited spots available</span>
              </div>
              <div className="text-3xl font-extrabold text-white mt-3 mb-4">
                7 Days{" "}
                <span className="text-base font-medium text-white/50">free trial</span>
              </div>
              <Link href="/orbit-academy#pricing">
                <button className="orbit-btn-primary w-full mb-3">
                  Enroll Now — It&apos;s Free
                </button>
              </Link>
              <Link href="/orbit-academy#pricing">
                <button className="orbit-btn-secondary w-full text-sm">
                  View All Pricing Plans
                </button>
              </Link>
              <ul className="mt-5 space-y-2">
                {["No credit card required", "Cancel anytime", "COPPA compliant & child-safe", "Parent dashboard access"].map(
                  (item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-xs text-white/50"
                    >
                      <span style={{ color: accentColor }}>✓</span>
                      {item}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
