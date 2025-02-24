import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

type PopoverProps = HTMLMotionProps<"div"> & {
  trigger: React.ReactNode;
  content: React.ReactNode;
}

export function Popover({ trigger, content, style, className, ...rest }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const togglePopover = () => setOpen((prev) => !prev);

  useEffect(() => {
    if (open && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Positioning the popover below the trigger with a small offset
      setPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
      });
    }
  }, [open]);

  return (
    <>
      <div ref={triggerRef} onClick={togglePopover} className="inline-block">
        {trigger}
      </div>
      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              {...rest}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={'absolute z-1000' + className ? ' '+className : ''}
              style={{
                top: position.top,
                left: position.left,
                ...style,
              }}
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
