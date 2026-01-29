"use client";

import { useState } from "react";
import { Document, Page } from "react-pdf";

interface PdfCarouselProps {
  pdfUrl: string;
}

const PdfCarousel = ({ pdfUrl }: PdfCarouselProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState(1);

  const nextPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page < numPages) setPage(page + 1);
  };

  const prevPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (page > 1) setPage(page - 1);
  };

  return (
    <div
      className="pdf-carousel"
      onClick={(e) => e.stopPropagation()}
      style={{ position: "relative" }}
    >
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        <Page
          pageNumber={page}
          width={520}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>

      {/* ◀ Arrow */}
      {page > 1 && (
        <button className="pdf-arrow left" onClick={prevPage}>
          ‹
        </button>
      )}

      {/* ▶ Arrow */}
      {page < numPages && (
        <button className="pdf-arrow right" onClick={nextPage}>
          ›
        </button>
      )}

      {/* Page indicator */}
      {numPages > 0 && (
        <div className="pdf-indicator">
          {page} / {numPages}
        </div>
      )}
    </div>
  );
};

export default PdfCarousel;
