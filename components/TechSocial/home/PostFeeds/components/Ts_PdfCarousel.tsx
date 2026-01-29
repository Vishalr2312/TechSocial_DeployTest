"use client";

import React, { useState } from "react";

interface Ts_PdfCarouselProps {
  pdfUrl: string;
  onOpen?: (url: string) => void;
}

const Ts_PdfCarousel = ({ pdfUrl, onOpen }: Ts_PdfCarouselProps) => {
  const [page, setPage] = useState(1);
  const MAX_PAGES = 50; // safe upper bound

  const nextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    // setPage((prev) => prev + 1);
    setPage((prev) => (prev < MAX_PAGES ? prev + 1 : prev));
  };

  const prevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div
      className="pdf-carousel"
      onClick={() => onOpen?.(pdfUrl)}
      style={{ cursor: "pointer" }}
      // style={{ position: "relative", width: "100%", height: "500px" }}
    >
      <div className="pdf-frame">
        <iframe
          src={`${pdfUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=FitH&zoom=page-width`}
          title="PDF Viewer"
          key={page} // Force re-render to ensure navigation works reliably
          // style={{
          //   width: "100%",
          //   height: "100%",
          //   border: "none",
          // }}
        />
      </div>

      {/* {page > 1 && (
        <button className="pdf-arrow left" onClick={prevPage}>
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
      )}

      <button className="pdf-arrow right" onClick={nextPage}>
        <span className="material-symbols-outlined">arrow_forward_ios</span>
      </button>

      <div className="pdf-indicator">Page {page}</div> */}
    </div>
  );
};

export default Ts_PdfCarousel;
