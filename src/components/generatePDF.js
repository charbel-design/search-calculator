import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Brand colors
const BRAND = '#2814ff';
const BRAND_LIGHT = '#eeeeff';
const PINK = '#c77d8a';
const PINK_LIGHT = '#fdf2f4';
const OPAL = '#5f9488';
const OPAL_LIGHT = '#f0f7f5';
const OCRE = '#c4975e';
const OCRE_LIGHT = '#fef8f0';
const DARK = '#1d1d1f';
const MID = '#6e6e73';
const LIGHT = '#a1a1a6';
const WHITE = '#ffffff';

// Hex to RGB
function hexToRGB(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Format currency
function formatCurrency(val) {
  if (!val) return '—';
  if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
  return `$${Math.round(val / 1000)}k`;
}

export function generateSearchReport(results, formData) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Helper: draw colored rectangle
  const drawRect = (x, yPos, w, h, color) => {
    doc.setFillColor(...hexToRGB(color));
    doc.rect(x, yPos, w, h, 'F');
  };

  // Helper: draw rounded rectangle
  const drawRoundedRect = (x, yPos, w, h, r, color) => {
    doc.setFillColor(...hexToRGB(color));
    doc.roundedRect(x, yPos, w, h, r, r, 'F');
  };

  // Helper: add text with word wrap, return new Y position
  const addWrappedText = (text, x, yPos, maxWidth, fontSize, color, fontStyle = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    doc.setTextColor(...hexToRGB(color));
    const lines = doc.splitTextToSize(text || '', maxWidth);
    doc.text(lines, x, yPos);
    return yPos + lines.length * (fontSize * 0.4);
  };

  // Helper: page footer
  const addFooter = (pageNum, totalPages) => {
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRGB(LIGHT));
    doc.text('CONFIDENTIAL — Prepared by Talent Gurus', margin, pageHeight - 10);
    doc.text(`talent-gurus.com`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    doc.text(`${pageNum}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
  };

  // Helper: section heading
  const addSectionHeading = (text, yPos) => {
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(BRAND));
    doc.text(text, margin, yPos);
    return yPos + 7;
  };

  // Helper: check page break
  const checkPageBreak = (neededSpace) => {
    if (y + neededSpace > pageHeight - 20) {
      addFooter(doc.internal.getNumberOfPages(), '');
      doc.addPage();
      y = 20;
      return true;
    }
    return false;
  };

  // Benchmark data
  const benchmark = results.benchmark || {};
  const adjustedBenchmark = results.adjustedBenchmark || {};
  const regionalMult = results.regionalMultiplier || 1;

  // ============================================================
  // PAGE 1: COVER
  // ============================================================

  // Top brand bar
  drawRect(0, 0, pageWidth, 60, BRAND);

  // Logo text
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TALENT GURUS', margin, 18);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Search Intelligence Report', margin, 25);

  // Score circle area — right side of header
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${results.score}`, pageWidth - margin - 18, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('/ 10', pageWidth - margin - 5, 30);

  doc.setFontSize(8);
  doc.text(results.label || '', pageWidth - margin, 38, { align: 'right' });

  // Role title and location
  y = 80;
  doc.setFontSize(26);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRGB(DARK));
  doc.text(results.displayTitle || formData?.positionType || '', margin, y);

  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRGB(MID));
  const locationText = formData?.location || '';
  const regionalNote = results.regionalData ? ` (${regionalMult}x regional adjustment)` : '';
  doc.text(locationText + regionalNote, margin, y);

  y += 5;
  doc.setFontSize(9);
  doc.setTextColor(...hexToRGB(LIGHT));
  doc.text(`Confidence: ${results.confidence || 'High'}`, margin, y);

  // Divider
  y += 8;
  drawRect(margin, y, contentWidth, 0.5, BRAND_LIGHT);

  // Bottom Line
  y += 10;
  drawRoundedRect(margin, y, contentWidth, 1, 1, BRAND);
  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...hexToRGB(BRAND));
  doc.text('The Bottom Line', margin, y);

  y += 6;
  y = addWrappedText(results.bottomLine || '', margin, y, contentWidth, 10, DARK);

  // Key Metrics Cards
  y += 8;
  const metricCardWidth = (contentWidth - 8) / 3;
  const metrics = [
    { label: 'Salary Guidance', value: results.salaryRangeGuidance || '—', color: OCRE_LIGHT, accent: OCRE },
    { label: 'Timeline', value: results.estimatedTimeline || '—', color: BRAND_LIGHT, accent: BRAND },
    { label: 'Availability', value: results.candidateAvailability || '—', color: OPAL_LIGHT, accent: OPAL }
  ];

  metrics.forEach((m, i) => {
    const cardX = margin + i * (metricCardWidth + 4);
    drawRoundedRect(cardX, y, metricCardWidth, 28, 2, m.color);
    drawRect(cardX, y, 2, 28, m.accent);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(m.accent));
    doc.text(m.label.toUpperCase(), cardX + 6, y + 7);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRGB(DARK));
    const valLines = doc.splitTextToSize(m.value, metricCardWidth - 10);
    doc.text(valLines.slice(0, 3), cardX + 6, y + 13);
  });

  y += 36;

  // Market Competitiveness
  if (results.marketCompetitiveness) {
    checkPageBreak(25);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(LIGHT));
    doc.text('MARKET COMPETITIVENESS', margin, y);
    y += 4;
    y = addWrappedText(results.marketCompetitiveness, margin, y, contentWidth, 9, DARK);
    y += 4;
  }

  // Sourcing Insight
  if (results.sourcingInsight && results.aiAnalysisSuccess) {
    checkPageBreak(20);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(LIGHT));
    doc.text('SOURCING CHANNELS', margin, y);
    y += 4;
    y = addWrappedText(results.sourcingInsight, margin, y, contentWidth, 9, DARK);
    y += 4;
  }

  addFooter(1, '');

  // ============================================================
  // PAGE 2: SALARY BENCHMARKS + SEARCH INTELLIGENCE
  // ============================================================
  doc.addPage();
  y = 20;

  // Header bar
  drawRect(0, 0, pageWidth, 12, BRAND);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TALENT GURUS', margin, 8);
  doc.text('Search Intelligence Report', pageWidth - margin, 8, { align: 'right' });

  y = addSectionHeading('Salary Benchmarks', y);

  if (adjustedBenchmark?.p25) {
    // Salary table
    const salaryData = [
      ['25th Percentile', formatCurrency(adjustedBenchmark.p25)],
      ['Median (50th)', formatCurrency(adjustedBenchmark.p50)],
      ['75th Percentile', formatCurrency(adjustedBenchmark.p75)]
    ];

    doc.autoTable({
      startY: y,
      head: [['Benchmark', 'Annual Compensation']],
      body: salaryData,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 4, textColor: hexToRGB(DARK) },
      headStyles: { fillColor: hexToRGB(BRAND_LIGHT), textColor: hexToRGB(BRAND), fontStyle: 'bold', fontSize: 8 },
      alternateRowStyles: { fillColor: [250, 250, 255] },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth / 2
    });

    y = doc.lastAutoTable.finalY + 6;

    // Benefits
    if (benchmark.benefits) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text('BENEFITS PACKAGE', margin, y);
      y += 4;

      const benefits = [
        ['Housing', benchmark.benefits.housing],
        ['Vehicle', benchmark.benefits.vehicle],
        ['Health', benchmark.benefits.health],
        ['Bonus', benchmark.benefits.bonus]
      ].filter(b => b[1]);

      doc.autoTable({
        startY: y,
        body: benefits,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 3, textColor: hexToRGB(DARK) },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 25, textColor: hexToRGB(MID) },
          1: { cellWidth: contentWidth - 25 }
        },
        margin: { left: margin, right: margin }
      });

      y = doc.lastAutoTable.finalY + 8;
    }
  }

  // Search Intelligence
  checkPageBreak(50);
  y = addSectionHeading('Search Intelligence', y);

  const searchMetrics = [];
  if (benchmark.offerAcceptanceRate) searchMetrics.push(['Offer Acceptance Rate', `${Math.round(benchmark.offerAcceptanceRate * 100)}%`]);
  if (benchmark.counterOfferRate) searchMetrics.push(['Counter-Offer Rate', `${Math.round(benchmark.counterOfferRate * 100)}%`]);
  if (benchmark.salaryGrowthRate) searchMetrics.push(['Salary Growth', `${Math.round(benchmark.salaryGrowthRate * 100)}% YoY`]);
  if (benchmark.typicalExperience) searchMetrics.push(['Typical Experience', `${benchmark.typicalExperience.min}–${benchmark.typicalExperience.typical} years`]);
  if (benchmark.timeToFill) searchMetrics.push(['Time to Fill (baseline)', `${benchmark.timeToFill} weeks`]);
  if (benchmark.relocationWillingness !== undefined) searchMetrics.push(['Relocation Willingness', `${Math.round(benchmark.relocationWillingness * 100)}%`]);
  if (benchmark.backgroundCheckTimeline) searchMetrics.push(['Due Diligence Timeline', `${benchmark.backgroundCheckTimeline} weeks`]);

  if (searchMetrics.length > 0) {
    doc.autoTable({
      startY: y,
      body: searchMetrics,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 4, textColor: hexToRGB(DARK) },
      columnStyles: {
        0: { fontStyle: 'bold', textColor: hexToRGB(MID), cellWidth: 55 },
        1: { fontStyle: 'bold', textColor: hexToRGB(BRAND) }
      },
      alternateRowStyles: { fillColor: [250, 250, 255] },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth * 0.7
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  // Sourcing Channels
  if (benchmark.sourcingChannels) {
    checkPageBreak(30);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(LIGHT));
    doc.text('SOURCING CHANNEL MIX', margin, y);
    y += 4;

    const channels = [
      ['Referral', `${Math.round(benchmark.sourcingChannels.referral * 100)}%`],
      ['Search Firm', `${Math.round(benchmark.sourcingChannels.agency * 100)}%`],
      ['Direct Outreach', `${Math.round(benchmark.sourcingChannels.direct * 100)}%`],
      ['Internal', `${Math.round(benchmark.sourcingChannels.internal * 100)}%`]
    ];

    doc.autoTable({
      startY: y,
      body: channels,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3, textColor: hexToRGB(DARK) },
      columnStyles: {
        0: { textColor: hexToRGB(MID), cellWidth: 35 },
        1: { fontStyle: 'bold', textColor: hexToRGB(BRAND), cellWidth: 20 }
      },
      margin: { left: margin, right: margin },
      tableWidth: contentWidth * 0.4
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  addFooter(2, '');

  // ============================================================
  // PAGE 3: KEY SUCCESS FACTORS + RECOMMENDATIONS + DRIVERS
  // ============================================================
  doc.addPage();
  y = 20;

  drawRect(0, 0, pageWidth, 12, BRAND);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TALENT GURUS', margin, 8);
  doc.text('Search Intelligence Report', pageWidth - margin, 8, { align: 'right' });

  // Key Success Factors
  if (results.keySuccessFactors?.length > 0) {
    y = addSectionHeading('Key Success Factors', y);
    results.keySuccessFactors.forEach(factor => {
      checkPageBreak(12);
      drawRoundedRect(margin, y - 3, contentWidth, 10, 1.5, OPAL_LIGHT);
      drawRect(margin, y - 3, 2, 10, OPAL);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRGB(DARK));
      const lines = doc.splitTextToSize(factor, contentWidth - 10);
      doc.text(lines, margin + 6, y + 2);
      y += Math.max(12, lines.length * 4 + 6);
    });
    y += 4;
  }

  // Recommended Adjustments
  if (results.recommendedAdjustments?.length > 0) {
    checkPageBreak(20);
    y = addSectionHeading('Recommended Adjustments', y);
    results.recommendedAdjustments.forEach(adj => {
      checkPageBreak(12);
      drawRoundedRect(margin, y - 3, contentWidth, 10, 1.5, OCRE_LIGHT);
      drawRect(margin, y - 3, 2, 10, OCRE);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRGB(DARK));
      const lines = doc.splitTextToSize(adj, contentWidth - 10);
      doc.text(lines, margin + 6, y + 2);
      y += Math.max(12, lines.length * 4 + 6);
    });
    y += 4;
  }

  // Red Flag Analysis
  if (results.redFlagAnalysis && results.aiAnalysisSuccess) {
    checkPageBreak(20);
    y = addSectionHeading('Watch Out For', y);
    drawRoundedRect(margin, y - 3, contentWidth, 1, 1.5, PINK_LIGHT);
    drawRect(margin, y - 3, 2, 1, PINK);
    y = addWrappedText(results.redFlagAnalysis, margin + 6, y + 2, contentWidth - 10, 9, DARK);
    y += 6;
  }

  // Complexity Drivers
  if (results.drivers?.length > 0) {
    checkPageBreak(40);
    y = addSectionHeading('Complexity Breakdown', y);

    const driverData = results.drivers
      .sort((a, b) => b.points - a.points)
      .map(d => [d.factor, d.rationale || '', `+${d.points}`]);

    doc.autoTable({
      startY: y,
      head: [['Factor', 'Detail', 'Points']],
      body: driverData,
      theme: 'plain',
      styles: { fontSize: 8, cellPadding: 4, textColor: hexToRGB(DARK) },
      headStyles: { fillColor: hexToRGB(BRAND_LIGHT), textColor: hexToRGB(BRAND), fontStyle: 'bold', fontSize: 7 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35 },
        2: { cellWidth: 18, halign: 'center', fontStyle: 'bold', textColor: hexToRGB(PINK) }
      },
      alternateRowStyles: { fillColor: [253, 253, 255] },
      margin: { left: margin, right: margin }
    });
    y = doc.lastAutoTable.finalY + 8;
  }

  addFooter(3, '');

  // ============================================================
  // PAGE 4: RETENTION RISK SCORE
  // ============================================================
  if (results.retentionRisk?.hasData) {
    doc.addPage();
    y = 20;

    drawRect(0, 0, pageWidth, 12, BRAND);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TALENT GURUS', margin, 8);
    doc.text('Search Intelligence Report', pageWidth - margin, 8, { align: 'right' });

    y = addSectionHeading('Retention Risk Score', y);

    const rr = results.retentionRisk;

    // Score display
    drawRoundedRect(margin, y, contentWidth, 30, 2, PINK_LIGHT);
    drawRect(margin, y, 3, 30, rr.riskColor);

    // Score number
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(rr.riskColor));
    doc.text(`${rr.riskScore}`, margin + 12, y + 18);

    // Risk level
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(rr.riskLevel.toUpperCase() + ' RISK', margin + 35, y + 12);

    // Risk bar
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRGB(MID));
    doc.text('Will this hire stick? Score based on role data, market conditions, and compensation position.', margin + 35, y + 18);

    // Visual bar
    const barX = margin + 35;
    const barW = contentWidth - 45;
    drawRoundedRect(barX, y + 22, barW, 4, 1.5, '#f5e6e9');
    drawRoundedRect(barX, y + 22, barW * (rr.riskScore / 100), 4, 1.5, rr.riskColor);

    y += 38;

    // Key metrics
    const retMetrics = [
      { label: '1st-YEAR ATTRITION', value: `${rr.firstYearAttrition}%`, color: PINK },
      { label: 'AVG TENURE', value: `${rr.avgTenure} yrs`, color: OCRE },
      { label: 'ANNUAL TURNOVER', value: `${rr.annualTurnover}%`, color: BRAND }
    ];

    const rmCardW = (contentWidth - 8) / 3;
    retMetrics.forEach((m, i) => {
      const cx = margin + i * (rmCardW + 4);
      drawRoundedRect(cx, y, rmCardW, 22, 2, WHITE);
      doc.setDrawColor(...hexToRGB('#e5e5ea'));
      doc.roundedRect(cx, y, rmCardW, 22, 2, 2, 'S');

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(m.color));
      doc.text(m.value, cx + rmCardW / 2, y + 10, { align: 'center' });

      doc.setFontSize(6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text(m.label, cx + rmCardW / 2, y + 17, { align: 'center' });
    });

    y += 30;

    // Top departure reasons
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(PINK));
    doc.text('WHY PEOPLE LEAVE THIS ROLE', margin, y);
    y += 5;

    rr.topReasons.forEach(reason => {
      drawRoundedRect(margin, y - 3, 0, 0, 1, WHITE); // clear
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...hexToRGB(DARK));
      doc.text(`•  ${reason}`, margin + 2, y);
      y += 5;
    });

    y += 4;

    // Risk factors table
    if (rr.riskFactors.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(PINK));
      doc.text('RISK FACTORS', margin, y);
      y += 4;

      const rfData = rr.riskFactors.map(rf => [rf.factor, rf.detail, rf.value]);

      doc.autoTable({
        startY: y,
        head: [['Factor', 'Detail', 'Value']],
        body: rfData,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 4, textColor: hexToRGB(DARK) },
        headStyles: { fillColor: hexToRGB(PINK_LIGHT), textColor: hexToRGB(PINK), fontStyle: 'bold', fontSize: 7 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 35 },
          2: { cellWidth: 30, fontStyle: 'bold', textColor: hexToRGB(PINK), halign: 'right' }
        },
        margin: { left: margin, right: margin }
      });
      y = doc.lastAutoTable.finalY + 8;
    }

    // Retention suggestions
    if (rr.suggestions.length > 0) {
      checkPageBreak(30);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(OPAL));
      doc.text('HOW TO IMPROVE RETENTION', margin, y);
      y += 5;

      rr.suggestions.forEach(sug => {
        checkPageBreak(18);
        drawRoundedRect(margin, y - 3, contentWidth, 15, 1.5, WHITE);
        drawRect(margin, y - 3, 2, 15, OPAL);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRGB(DARK));
        doc.text(sug.title, margin + 6, y + 1);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(MID));
        const detailLines = doc.splitTextToSize(sug.detail, contentWidth - 12);
        doc.text(detailLines.slice(0, 2), margin + 6, y + 6);
        y += Math.max(18, detailLines.length * 3.5 + 8);
      });
    }

    // Comp structure
    if (benchmark.compensationStructure) {
      checkPageBreak(25);
      y += 2;
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text('COMPENSATION STRUCTURE', margin, y);
      y += 5;

      const compData = [
        ['Base', `${Math.round(benchmark.compensationStructure.basePercent * 100)}%`],
        ['Bonus', `${Math.round(benchmark.compensationStructure.bonusPercent * 100)}%`],
        ['Benefits', `${Math.round(benchmark.compensationStructure.benefitsPercent * 100)}%`],
        ['Signing Bonus', `In ${Math.round(benchmark.compensationStructure.signingBonusFrequency * 100)}% of placements ($${benchmark.compensationStructure.signingBonusRange})`]
      ];

      doc.autoTable({
        startY: y,
        body: compData,
        theme: 'plain',
        styles: { fontSize: 8, cellPadding: 3, textColor: hexToRGB(DARK) },
        columnStyles: {
          0: { fontStyle: 'bold', textColor: hexToRGB(MID), cellWidth: 30 }
        },
        margin: { left: margin, right: margin },
        tableWidth: contentWidth * 0.7
      });
      y = doc.lastAutoTable.finalY + 6;
    }

    addFooter(doc.internal.getNumberOfPages(), '');
  }

  // ============================================================
  // PAGE 5: DECISION INTELLIGENCE
  // ============================================================
  if (results.decisionIntelligence && results.aiAnalysisSuccess) {
    doc.addPage();
    y = 20;

    drawRect(0, 0, pageWidth, 12, BRAND);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('TALENT GURUS', margin, 8);
    doc.text('Search Intelligence Report', pageWidth - margin, 8, { align: 'right' });

    const di = results.decisionIntelligence;

    y = addSectionHeading('Decision Intelligence', y);

    // Trade-Off Scenarios
    if (di.tradeoffScenarios?.initial?.length > 0) {
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text('TRADE-OFF SCENARIOS', margin, y);
      y += 5;

      di.tradeoffScenarios.initial.forEach(scenario => {
        checkPageBreak(12);
        drawRoundedRect(margin, y - 3, contentWidth, 10, 1.5, BRAND_LIGHT);
        drawRect(margin, y - 3, 2, 10, BRAND);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(DARK));
        const lines = doc.splitTextToSize(scenario, contentWidth - 10);
        doc.text(lines, margin + 6, y + 1);
        y += Math.max(12, lines.length * 3.5 + 6);
      });
      y += 4;
    }

    // Candidate Psychology
    if (di.candidatePsychology?.initial?.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text('CANDIDATE PSYCHOLOGY', margin, y);
      y += 5;

      di.candidatePsychology.initial.forEach(insight => {
        checkPageBreak(10);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(DARK));
        const lines = doc.splitTextToSize(`•  ${insight}`, contentWidth);
        doc.text(lines, margin + 2, y);
        y += lines.length * 3.5 + 2;
      });
      y += 4;
    }

    // Probability + Mandate Strength side by side
    const hasProb = di.probabilityOfSuccess?.initialLabel;
    const hasMandate = di.mandateStrength?.initial?.score;

    if (hasProb || hasMandate) {
      checkPageBreak(35);
      const halfW = (contentWidth - 4) / 2;

      if (hasProb) {
        drawRoundedRect(margin, y, halfW, 28, 2, OPAL_LIGHT);
        drawRect(margin, y, 2, 28, OPAL);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRGB(OPAL));
        doc.text('SUCCESS PROBABILITY', margin + 6, y + 7);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRGB(DARK));
        doc.text(di.probabilityOfSuccess.initialLabel, margin + 6, y + 16);

        if (di.probabilityOfSuccess.initialConfidence) {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...hexToRGB(MID));
          const confLines = doc.splitTextToSize(di.probabilityOfSuccess.initialConfidence, halfW - 10);
          doc.text(confLines.slice(0, 2), margin + 6, y + 22);
        }
      }

      if (hasMandate) {
        const mandateX = margin + halfW + 4;
        drawRoundedRect(mandateX, y, halfW, 28, 2, OCRE_LIGHT);
        drawRect(mandateX, y, 2, 28, OCRE);

        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRGB(OCRE));
        doc.text('MANDATE STRENGTH', mandateX + 6, y + 7);

        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...hexToRGB(DARK));
        doc.text(`${di.mandateStrength.initial.score} / 10`, mandateX + 6, y + 16);

        if (di.mandateStrength.initial.rationale) {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(...hexToRGB(MID));
          const ratLines = doc.splitTextToSize(di.mandateStrength.initial.rationale, halfW - 10);
          doc.text(ratLines.slice(0, 2), mandateX + 6, y + 22);
        }
      }

      y += 36;
    }

    // False Signals
    if (di.falseSignals?.initial?.length > 0) {
      checkPageBreak(25);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(LIGHT));
      doc.text("DON'T BE FOOLED BY", margin, y);
      y += 5;

      di.falseSignals.initial.forEach(signal => {
        checkPageBreak(10);
        drawRoundedRect(margin, y - 3, contentWidth, 9, 1.5, PINK_LIGHT);
        drawRect(margin, y - 3, 2, 9, PINK);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(DARK));
        const lines = doc.splitTextToSize(signal, contentWidth - 10);
        doc.text(lines, margin + 6, y + 1);
        y += Math.max(12, lines.length * 3.5 + 4);
      });
      y += 4;
    }

    // Negotiation Leverage
    if (results.negotiationLeverage) {
      checkPageBreak(40);
      y = addSectionHeading('Negotiation Leverage', y);

      const halfW = (contentWidth - 4) / 2;

      // Candidate advantages
      drawRoundedRect(margin, y, halfW, 4, 2, PINK_LIGHT);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(PINK));
      doc.text('CANDIDATE ADVANTAGES', margin + 4, y + 6);
      let yLeft = y + 10;

      (results.negotiationLeverage.candidateAdvantages || []).forEach(a => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(DARK));
        const lines = doc.splitTextToSize(`•  ${a}`, halfW - 6);
        doc.text(lines, margin + 4, yLeft);
        yLeft += lines.length * 3.5 + 2;
      });

      // Employer advantages
      const empX = margin + halfW + 4;
      drawRoundedRect(empX, y, halfW, 4, 2, OPAL_LIGHT);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...hexToRGB(OPAL));
      doc.text('YOUR ADVANTAGES', empX + 4, y + 6);
      let yRight = y + 10;

      (results.negotiationLeverage.employerAdvantages || []).forEach(a => {
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...hexToRGB(DARK));
        const lines = doc.splitTextToSize(`•  ${a}`, halfW - 6);
        doc.text(lines, empX + 4, yRight);
        yRight += lines.length * 3.5 + 2;
      });

      y = Math.max(yLeft, yRight) + 6;
    }

    addFooter(doc.internal.getNumberOfPages(), '');
  }

  // ============================================================
  // LAST PAGE: WHAT'S NEXT + CTA
  // ============================================================
  doc.addPage();
  y = 20;

  drawRect(0, 0, pageWidth, 12, BRAND);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('TALENT GURUS', margin, 8);
  doc.text('Search Intelligence Report', pageWidth - margin, 8, { align: 'right' });

  y = addSectionHeading("What's Next", y);

  if (results.whatsNext?.intro) {
    y = addWrappedText(results.whatsNext.intro, margin, y, contentWidth, 9, MID);
    y += 6;
  }

  const steps = [
    { num: '1', title: 'Discovery Call', duration: '30 min', text: results.whatsNext?.discoveryCall || 'We walk through your analysis together and align on what the right person looks like.' },
    { num: '2', title: 'Sourcing Strategy', duration: 'Week 1', text: results.whatsNext?.sourcingStrategy || 'Based on your complexity, we build a sourcing plan — which networks to tap and how to position the opportunity.' },
    { num: '3', title: 'Curated Shortlist', duration: 'Weeks 2-4', text: results.whatsNext?.shortlist || 'You receive a vetted shortlist with social due diligence, reference notes, and our honest assessment.' },
    { num: '4', title: 'Placement Support', duration: 'Through close', text: results.whatsNext?.placementSupport || 'We coordinate interviews, support offer negotiation, and stay involved through the first 90 days.' }
  ];

  steps.forEach(step => {
    checkPageBreak(25);

    // Step circle
    drawRoundedRect(margin, y, 8, 8, 4, BRAND);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(step.num, margin + 4, y + 5.5, { align: 'center' });

    // Title + duration
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...hexToRGB(DARK));
    doc.text(step.title, margin + 12, y + 3);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRGB(BRAND));
    doc.text(step.duration, margin + 12 + doc.getTextWidth(step.title) + 4, y + 3);

    // Description
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...hexToRGB(MID));
    const stepLines = doc.splitTextToSize(step.text, contentWidth - 12);
    doc.text(stepLines, margin + 12, y + 8);
    y += Math.max(18, stepLines.length * 3.5 + 12);
  });

  // CTA box
  y += 8;
  checkPageBreak(40);
  drawRoundedRect(margin, y, contentWidth, 35, 3, BRAND);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('Ready for the Complete Picture?', margin + contentWidth / 2, y + 12, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Schedule your 30-minute strategy call — no commitment.', margin + contentWidth / 2, y + 20, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('calendly.com/charbel-talentgurus', margin + contentWidth / 2, y + 28, { align: 'center' });

  // Data sources
  y += 45;
  checkPageBreak(15);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...hexToRGB(LIGHT));
  const sources = 'Data Sources: BLS • Talent Gurus Placement Data • Indeed, ZipRecruiter, Salary.com, PayScale • Flying Fish & Quay Group Maritime Reports • Lighthouse Careers & Morgan & Mallet • KPMG / Egon Zehnder Family Office Reports • Regional Cost-of-Living Indices';
  const sourceLines = doc.splitTextToSize(sources, contentWidth);
  doc.text(sourceLines, margin, y);

  y += 10;
  doc.setFontSize(6);
  doc.text('AI-assisted analysis for informational purposes only. Not legal, financial, or employment advice.', margin, y);

  addFooter(doc.internal.getNumberOfPages(), '');

  // ============================================================
  // SAVE
  // ============================================================
  const filename = `TG_Search_Report_${(results.displayTitle || 'Analysis').replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
