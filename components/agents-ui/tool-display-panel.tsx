'use client';

import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useToolDisplay, type ToolDisplayItem } from '@/hooks/use-tool-display';

/* ─── Icons (inline SVG to avoid extra deps) ─── */

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconExpand({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconShrink({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 2v4H2M10 2v4h4M6 14v-4H2M10 14v-4h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLink({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M5 1H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V7M7 1h4v4M5.5 6.5L11 1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Jarvis Spinner ─── */

function JarvisSpinner() {
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      {/* Outer ring */}
      <motion.div
        className="absolute h-16 w-16 rounded-full border-2 border-cyan-400/30"
        style={{ borderTopColor: 'oklch(0.75 0.15 195)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      {/* Middle ring */}
      <motion.div
        className="absolute h-10 w-10 rounded-full border-2 border-cyan-300/20"
        style={{ borderBottomColor: 'oklch(0.8 0.12 195)' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner dot */}
      <motion.div
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: 'oklch(0.8 0.15 195)' }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

/* ─── Loading View ─── */

function LoadingView({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-10">
      <JarvisSpinner />
      <motion.p
        className="text-sm font-medium tracking-wide"
        style={{ color: 'oklch(0.75 0.12 195)' }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {title || 'Processing...'}
      </motion.p>
    </div>
  );
}

/* ─── Results View ─── */

function ResultsView({ title, items }: { title?: string; items: ToolDisplayItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'oklch(0.7 0.1 195)' }}
        >
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <motion.a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-white/5 p-3 transition-colors hover:border-cyan-400/20 hover:bg-white/5"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-white/90 group-hover:text-cyan-300">
                {item.title}
              </h4>
              <IconLink className="mt-0.5 shrink-0 text-white/30 group-hover:text-cyan-400" />
            </div>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50">
              {item.snippet}
            </p>
          </motion.a>
        ))}
      </div>
    </div>
  );
}

/* ─── Media View ─── */

function MediaView({
  title,
  mediaType,
  url,
}: {
  title?: string;
  mediaType?: string;
  url: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {title && (
        <h3
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'oklch(0.7 0.1 195)' }}
        >
          {title}
        </h3>
      )}
      <div className="overflow-hidden rounded-lg border border-white/5">
        {mediaType === 'youtube' ? (
          <iframe
            src={url}
            className="aspect-video w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : mediaType === 'video' ? (
          <video src={url} controls className="aspect-video w-full" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={title || 'Media'} className="w-full object-contain" />
        )}
      </div>
    </div>
  );
}

/* ─── Webpage View ─── */

function WebpageView({ title, url, content }: { title?: string; url?: string; content?: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        {title && (
          <h3
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: 'oklch(0.7 0.1 195)' }}
          >
            {title}
          </h3>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] text-white/30 transition-colors hover:text-cyan-400"
          >
            Open <IconLink />
          </a>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto rounded-lg border border-white/5 bg-white/[0.02] p-4">
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-white/70">{content}</p>
      </div>
    </div>
  );
}

/* ─── Main Panel ─── */

export function ToolDisplayPanel() {
  const { isOpen, isFullscreen, isLoading, message, close, toggleFullscreen } = useToolDisplay();

  return (
    <AnimatePresence>
      {isOpen && message && (
        <motion.div
          data-slot="tool-display-panel"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={[
            'absolute z-40',
            isFullscreen
              ? 'inset-4 md:inset-8'
              : 'right-3 top-4 w-[360px] max-w-[calc(100vw-24px)] md:right-6 md:top-6 md:w-[420px]',
          ].join(' ')}
        >
          {/* Jarvis glass panel */}
          <div
            className="relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-2xl"
            style={{
              background:
                'linear-gradient(135deg, oklch(0.15 0.02 230 / 0.85), oklch(0.12 0.015 210 / 0.9))',
              borderColor: 'oklch(0.5 0.12 195 / 0.2)',
              boxShadow:
                '0 0 40px oklch(0.6 0.15 195 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.05)',
              backdropFilter: 'blur(24px) saturate(1.5)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.5)',
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, oklch(0.7 0.15 195 / 0.5), transparent)',
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2">
              <div className="flex items-center gap-2">
                {/* Status dot */}
                <motion.div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'oklch(0.75 0.15 195)' }}
                  animate={isLoading ? { opacity: [0.4, 1, 0.4] } : { opacity: 1 }}
                  transition={
                    isLoading ? { duration: 1, repeat: Infinity, ease: 'easeInOut' } : {}
                  }
                />
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: 'oklch(0.65 0.08 195)' }}
                >
                  {isLoading ? 'Processing' : 'Display'}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={toggleFullscreen}
                  className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-cyan-400"
                  aria-label={isFullscreen ? 'Minimize' : 'Fullscreen'}
                >
                  {isFullscreen ? <IconShrink /> : <IconExpand />}
                </button>
                <button
                  onClick={close}
                  className="rounded-md p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400"
                  aria-label="Close"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-4 h-px bg-white/5" />

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LoadingView title={message.title} />
                  </motion.div>
                ) : message.type === 'results' && message.items ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ResultsView title={message.title} items={message.items} />
                  </motion.div>
                ) : message.type === 'media' && message.url ? (
                  <motion.div
                    key="media"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <MediaView
                      title={message.title}
                      mediaType={message.media_type}
                      url={message.url}
                    />
                  </motion.div>
                ) : message.type === 'webpage' ? (
                  <motion.div
                    key="webpage"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <WebpageView
                      title={message.title}
                      url={message.url}
                      content={message.content}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background:
                  'linear-gradient(90deg, transparent, oklch(0.5 0.1 195 / 0.3), transparent)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
