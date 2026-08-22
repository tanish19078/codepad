const fs = require('fs');
const path = require('path');

const raw = fs.readFileSync(path.join(__dirname, 'docx_text.txt'), 'utf8');
const lines = raw.split(/\r?\n/).map(l => l.replace(/^\[P\]/, '').replace(/\s+$/,''));

const SECTIONS = {
  1:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  2:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  3:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  4:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  5:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  6:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  7:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  8:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  9:  { name: 'Section A', title: 'Static Members & Static Blocks' },
  10: { name: 'Section A', title: 'Static Members & Static Blocks' },
  11: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  12: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  13: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  14: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  15: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  16: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  17: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  18: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  19: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  20: { name: 'Section B', title: 'Inheritance, Polymorphism, Abstraction & Interfaces' },
  21: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  22: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  23: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  24: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  25: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  26: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  27: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  28: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  29: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  30: { name: 'Section C', title: 'String, StringBuilder & String Comparisons' },
  31: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  32: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  33: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  34: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  35: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  36: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  37: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  38: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  39: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
  40: { name: 'Section D', title: 'Multidimensional Arrays, Packages & Access Modifiers' },
};

// Find body question headers: "Q<n>. <title>" followed by a difficulty/concept line
const qHeaderRe = /^Q(\d+)\.\s+(.+)$/;
const diffRe = /^\s*(EASY|MEDIUM-HARD|MEDIUM|HARD)\s+Concept:\s*(.*)$/i;

const questions = [];
let i = 0;
while (i < lines.length) {
  const m = lines[i].match(qHeaderRe);
  if (m) {
    const nextNonEmpty = (() => { for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) if (lines[j].trim()) return lines[j]; return ''; })();
    const dm = nextNonEmpty.match(diffRe);
    if (dm && !questions.some(q => q.id === parseInt(m[1], 10))) {
      questions.push({
        id: parseInt(m[1], 10),
        title: m[2].trim(),
        difficulty: dm[1].toUpperCase(),
        concept: dm[2].trim(),
        section: SECTIONS[parseInt(m[1], 10)] || { name: '', title: '' },
        headerIndex: i,
      });
      i += 2;
      continue;
    }
  }
  i++;
}

function sliceBetween(startIdx, endIdx) {
  // lines between markers, exclusive
  return lines.slice(startIdx + 1, endIdx);
}

function findMarker(from, text) {
  for (let j = from; j < lines.length; j++) {
    if (lines[j].trim() === text) return j;
  }
  return -1;
}

function cleanBlock(arr, opts = {}) {
  let out = arr.map(l => l.replace(/\s+$/, ''));
  if (!opts.keepInnerBlankEdges) {
    while (out.length && out[0].trim() === '') out.shift();
    while (out.length && out[out.length - 1].trim() === '') out.pop();
  }
  return out.join('\n');
}

for (let k = 0; k < questions.length; k++) {
  const q = questions[k];
  const start = q.headerIndex + 2; // skip title + diff line
  const end = k + 1 < questions.length ? questions[k + 1].headerIndex : lines.length;

  const pStmt = findMarker(start, 'PROBLEM STATEMENT');
  const pCons = findMarker(pStmt, 'CONSTRAINTS');
  const pPre  = findMarker(pCons, 'PREDEFINED CODE');
  const pSam  = findMarker(pPre, 'SAMPLE INPUT & OUTPUT');
  const pExp  = findMarker(pSam, 'EXPLANATION');
  const pSol  = findMarker(pExp, 'COMPLETE SOLUTION');

  // complexity line after solution start
  let pTime = -1;
  for (let j = pSol + 1; j < end; j++) {
    if (/Time:/.test(lines[j])) { pTime = j; break; }
  }

  // predefined code: first non-empty line is filename e.g. Main.java, rest is code until SAMPLE header
  const preBlock = sliceBetween(pPre, pSam);
  let fileName = 'Main.java';
  let codeStart = 0;
  if (preBlock.length && /\.java/.test(preBlock[0].trim())) { fileName = preBlock[0].trim(); codeStart = 1; }
  q.predefinedCode = cleanBlock(preBlock.slice(codeStart));

  const solBlock = sliceBetween(pSol, pTime === -1 ? end : pTime);
  q.solutionCode = cleanBlock(solBlock.slice(codeStart)); // same filename line position

  // sample input / output
  const samBlock = sliceBetween(pSam, pExp);
  const inIdx = samBlock.findIndex(l => l.trim() === 'SAMPLE INPUT');
  const outIdx = samBlock.findIndex(l => l.trim() === 'SAMPLE OUTPUT');
  q.sampleInput = cleanBlock(samBlock.slice(inIdx + 1, outIdx));
  q.sampleOutput = cleanBlock(samBlock.slice(outIdx + 1));

  q.statement = cleanBlock(sliceBetween(pStmt, pCons));
  q.constraints = cleanBlock(sliceBetween(pCons, pPre));
  q.explanation = cleanBlock(sliceBetween(pExp, pSol));

  const timeLine = pTime !== -1 ? lines[pTime] : '';
  const tm = timeLine.match(/Time:\s*([^\s💾⏱ ].*(?=\s*💾)|[^\s💾⏱ ]+)/);
  q.timeComplexity = (timeLine.match(/Time:\s*(.+?)(?:\s{2,}|💾|$)/) || [])[1] || '';
  q.spaceComplexity = (timeLine.match(/Space:\s*(.+?)$/) || [])[1] || '';

  delete q.headerIndex;
}

// validation
const problems = [];
for (const q of questions) {
  for (const f of ['statement','constraints','predefinedCode','sampleInput','sampleOutput','explanation','solutionCode']) {
    if (!q[f] || !q[f].trim()) problems.push(`Q${q.id} missing ${f}`);
  }
}
if (questions.length !== 40) problems.push(`Expected 40 questions, got ${questions.length}`);

const outFile = path.join(__dirname, '..', 'public', 'questions.json');
fs.writeFileSync(outFile, JSON.stringify(questions, null, 2), 'utf8');
console.log(`Parsed ${questions.length} questions -> ${outFile}`);
console.log(problems.length ? 'PROBLEMS:\n' + problems.join('\n') : 'All fields present. OK');
