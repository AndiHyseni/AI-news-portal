export const PrintStyles = `
  @media print {
    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .newspaper-print {
      display: block !important;
      visibility: visible !important;
      background: white !important;
      color: black !important;
      font-family: "Times New Roman", Times, serif !important;
      padding: 0.5cm !important;
    }

    .newspaper-header {
      text-align: center;
      border-bottom: 2px solid black;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .newspaper-title {
      font-size: 36px;
      font-weight: bold;
      margin: 0;
      color: black !important;
    }

    .newspaper-meta {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      font-style: italic;
      font-size: 12px;
    }

    .newspaper-content {
      column-count: 2;
      column-gap: 20px;
      text-align: justify;
    }

    .newspaper-article {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 15px;
      display: inline-block;
      width: 100%;
    }

    .article-image-container {
      margin-bottom: 8px;
    }

    .article-image {
      max-width: 100%;
      height: auto;
      display: block;
      margin-bottom: 5px;
    }

    .article-title {
      font-size: 16px;
      font-weight: bold;
      margin: 0 0 5px;
      line-height: 1.2;
      color: black !important;
    }

    .article-date {
      font-size: 10px;
      font-style: italic;
      margin: 0 0 5px;
      color: black !important;
    }

    .article-summary {
      font-size: 11px;
      font-weight: bold;
      margin: 0 0 8px;
      color: black !important;
      line-height: 1.3;
    }

    .article-text {
      font-size: 11px;
      line-height: 1.4;
      color: black !important;
      margin: 0;
    }

    .newspaper-footer {
      text-align: center;
      border-top: 1px solid black;
      margin-top: 15px;
      padding-top: 10px;
      font-size: 10px;
      color: black !important;
    }

    /* Additional spacing optimizations */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    p {
      margin-bottom: 5px;
    }

    img {
      vertical-align: middle;
    }
  }
`;
