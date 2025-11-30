import { GoogleGenerativeAI } from '@google/generative-ai';
import { Item } from './types';

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY not found. Please set it in your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const SUMMARIZE_PROMPT = `INSTRUCTION SET: SENIOR COMPUTATIONAL SYNTHESIZER MANDATE

You are a Senior Computational Synthesizer and Methodological Reviewer. Your mission is to perform an exhaustive, verifiable technical synthesis and critical analysis of the provided source documents.

1. Output MUST be formatted using Strict Markdown, including all specified headings (##, ###, ####).
2. Maintain an exclusively Formal, Technical, and Analytical tone. Avoid descriptive language, hyperbole, or imprecise terminology.
3. The analysis MUST be broken down into the four mandatory parts listed below.
4. Use LaTeX enclosed by $...$ for all mathematical notation, formulas, and variables.
5. All claims must be supported by direct, in-text citations to the source documents using the format.

### 1. MISSION STATEMENT: Deep Research Synthesis and Verification

Define the core scope of this analysis: To systematically synthesize the technical content, rigorously deconstruct all mathematical and algorithmic components, and provide a critical review of the methodologies and limitations across all provided source material.

*   **1.1 Output Constraint:** Ensure every step in the analysis is explicit, traceable, and structured sequentially to facilitate external review.
*   **1.2 Non-Negotiable Criterion:** The required analysis in Part 3 (Mathematical Deconstruction) must adhere strictly to the provided template for EVERY formula identified, ensuring mathematical transparency is the highest priority.

### 2. CORE RESEARCH SYNTHESIS

Structure the fundamental extracted information as follows:

*   **2.1 Executive Synthesis:** Draft a concise, high-fidelity summary (max 250 words) detailing the primary objective of the collective sources, the overarching domain context, and the single most significant finding or unifying technical trend observed.
*   **2.2 Methodological Overview and Categorization:** Systematically group the source documents based on their primary research methodology.
    *   **Group A: Quantitative Methods:** List sources focused on numerical modeling, statistical analysis, or large-scale data processing. Identify the primary statistical tests or modeling techniques employed (e.g., Regression, ANOVA, Bayesian inference).
    *   **Group B: Qualitative Methods:** List sources focused on interpretive data, case studies, or structured interviews. Assess the primary data collection and analytical methods used (e.g., Thematic Analysis, Grounded Theory).
    *   **Group C: Mixed/Computational Methods:** List sources that combine approaches or rely heavily on algorithmic development and technical specification.
*   **2.3 Key Results and Interdisciplinary Trends:** Identify and articulate three major clusters of technical findings. For each cluster, explicitly identify the interdisciplinary connections or implications that extend beyond the primary domain.

### 3. MATHEMATICAL ALGORITHMIC DECONSTRUCTION (CRITICAL MANDATE)

You MUST identify every unique mathematical formula, equation, or complex algorithm used to derive results or define core concepts within the source material. For EACH one, you must reproduce the following strict template.

**MANDATE EXHAUSTIVENESS CHECK:** If no mathematical content is identified across all sources, you must explicitly state the following and proceed to Part 4:
> CRITICAL MANDATE STATUS: N/A - No mathematical content identified in the source documents requiring deconstruction.

#### 3.N Formula Title/Identifier (e.g., The Optimization Function)

*   **3.N.1 Formula Identification:**
    *   Present the equation verbatim using LaTeX: $$ $$

*   **3.N.2 Variable Glossary:**
    *   Define EVERY symbol and variable used in the formula. Use a precise, bulleted list detailing the symbol, its definition, unit of measure (if applicable), and domain classification (e.g., $\lambda$ = Regularization parameter, dimensionless, scalar constant).

*   **3.N.3 Step-by-Step Derivation or Proof (Chain-of-Thought):**
    *   Provide a sequential, numbered list detailing the algebraic steps required to derive the final form of the equation from its fundamental components, or, for algorithms, the exact sequential steps of execution.
        1. Start with the fundamental relationship or premise (Equation 1).
        2. Detail the substitution, simplification, or transformation (Equation 2).
        3. Continue until the final presented formula is reached, explaining the function of each step (e.g., "Step 3: Integration is performed to account for [domain rationale]").

*   **3.N.4 Conceptual Rationale:**
    *   Explain the theoretical significance and the boundary conditions under which the formula is valid. Describe the core problem it is intended to solve.

*   **3.N.5 Practical Application Example:**
    *   Provide a brief, realistic example of how this formula is applied within the context of the source material's domain, using hypothetical values for key inputs.

### 4. CRITIQUE AND LIMITATION ANALYSIS

*   **4.1 Methodological Weaknesses and Bias:** Based on the synthesis in Part 2, critique the robustness of the methodologies employed. Identify potential areas of bias, assess the representativeness of sampling strategies, and discuss any identified limitations in the data sources or underlying assumptions. Focus on concrete, justifiable critiques.

*   **4.2 Five Underexplored Research Gaps:** List five novel, specific research questions that remain fundamentally unanswered based on the collective provided material. For each question, provide a concise justification explaining why it is an underexplored gap, referencing limitations identified in Section 4.1 or missing elements in the theoretical framework.

*   **4.3 Future Directions and Recommendations:** Propose concrete technical or methodological recommendations for future research building upon the sources. Suggestions should focus on improving data fidelity, expanding the application domain, or utilizing alternative methods.`;

export async function generateSummary(items: Item[]): Promise<string> {
  if (items.length === 0) {
    return "No items selected for summarization.";
  }

  const context = items.map((item, index) => 
    `Source ${index + 1} (${item.title}):\nURL: ${item.url}\nDomain: ${item.domain}\nType: ${item.type}\nContent: ${item.content || `[Content not yet extracted. Please analyze based on the title "${item.title}" and URL: ${item.url}]`}`
  ).join('\n\n');

  try {
    const result = await model.generateContent(`${SUMMARIZE_PROMPT}\n\nSource Documents:\n${context}`);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}
