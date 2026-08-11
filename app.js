// NUST PUBLICATIONS & CONFERENCE ELIGIBILITY PORTAL - CORE LOGIC

const app = {
    // Current application state
    state: {
        currentFlow: null,
        currentStep: 0,
        answers: {},
        activeQuestions: [],
        history: []
    },

    // Theme state
    theme: 'dark',

    // Question Database
    questions: {
        conference: [
            {
                id: 'role',
                text: 'What is your current role/status at NUST?',
                desc: 'Eligibility and funding ceilings differ depending on whether you are faculty, a PhD scholar, or an MS student.',
                options: [
                    { text: 'Regular Faculty (>= 6 months service with valid contract)', value: 'faculty', next: 'serving' },
                    { text: 'Bonafide PhD Scholar (in research phase)', value: 'phd', next: 'serving' },
                    { text: 'Bonafide MS Student', value: 'ms', next: 'serving', note: 'Sponsored for conference registration fee only (up to USD 700).' },
                    { text: 'Other (Non-faculty / Non-student / Temporary staff)', value: 'other', ineligible: 'Only regular NUST faculty members, PhD scholars, and MS students are eligible for conference sponsorship. Non-faculty staff travel expenses must be borne by their respective institutions from their own resources.', ref: 'Central travel grant funds are dedicated strictly to active NUST faculty, PhD scholars, and MS students to support core research programs. If you are temporary or non-faculty staff, please consult your school\'s local budget for alternative travel support.' }
                ]
            },
            {
                id: 'serving',
                text: 'Are you currently serving at a NUST Campus?',
                desc: 'Sponsorship is only for active campus faculty and students.',
                options: [
                    { text: 'Yes, actively serving on campus', value: 'yes', next: 'authorship' },
                    { text: 'No, currently on leave (EOL, Study Leave, ex-Pakistan Leave) or sponsored program abroad', value: 'no', ineligible: 'NUST faculty members or students already abroad on a sponsored program, or on leave (Extraordinary Leave, Study Leave, ex-Pakistan Leave), will not be considered for sponsorship.', ref: 'Sponsorship requires active presence at a NUST campus. Faculty and students who are already abroad on study leave, extraordinary leave, or other sponsored programs must utilize external or local project funding instead.' }
                ]
            },
            {
                id: 'authorship',
                text: 'What is your authorship position on the research paper?',
                desc: 'Conference sponsorship is generally restricted to the primary presenter of the paper.',
                options: [
                    { text: 'Principal / First Author', value: 'first', next: 'project_fund' },
                    { text: 'Corresponding Author or Supervisor (and First Author is unable/ineligible to present due to exceptional circumstances)', value: 'supervisor_corr', next: 'project_fund' },
                    { text: 'Co-Author (without first author exceptional circumstances)', value: 'coauthor', ineligible: 'In case of multi-authored papers, the travel request is only applicable for the first author. The supervisor of the first author or the corresponding author can only be sponsored if the first author is ineligible or unable to present due to exceptional circumstances beyond control.', ref: 'To optimize the utilization of research funds, NUST sponsors only the first author to present. Exceptions are made for supervisors/corresponding authors only if the first author cannot travel due to documentable circumstances.' }
                ]
            },
            {
                id: 'project_fund',
                text: 'Do you have an active research project that contains a budget for "International Travel for Conference"?',
                desc: 'If you have a funded project containing travel budgets, you must utilize that budget first.',
                options: [
                    { text: 'No, no travel budget is available in any of my active projects', value: 'no', next: 'prior_sponsorship' },
                    { text: 'Yes, I have an active project containing travel heads related to this conference topic', value: 'yes', ineligible: 'A faculty member with a related funded project containing the sub-head of "International Travel for Conference" within the project must avail travel funding from the project itself and will not be sponsored from NUST central travel funds.', ref: 'If your research project has a dedicated budget head for international conference travel, you must utilize those project funds first. This preserves central university grants for researchers without project funding.' }
                ]
            },
            {
                id: 'prior_sponsorship',
                text: 'Have you availed a NUST conference travel sponsorship in the current fiscal year?',
                desc: 'Standard policy limits travel sponsorship to once per fiscal year.',
                options: [
                    { text: 'No, I have not availed any sponsorship in this fiscal year', value: 'no', next: 'maturity' },
                    { text: 'Yes, I have already availed one sponsorship in this fiscal year', value: 'yes', next: 'performance_exemption' }
                ]
            },
            {
                id: 'performance_exemption',
                text: 'Do you meet any of the high-performer criteria for a second sponsorship?',
                desc: 'Exceptions to the once-a-year rule are granted for outstanding research output.',
                options: [
                    { text: 'I have published 2x Web of Science Q1 papers after the sponsored conference date', value: '2xq1', next: 'maturity' },
                    { text: 'I have published 1x WoS-Q1 article and have 1x approved research project >= PKR 2.0M after the conference', value: '1xq1_project', next: 'maturity' },
                    { text: 'I am a recent winner of a NUST Best Performer Category (Best Researcher, Best Innovator, Best Teacher)', value: 'best_performer', next: 'maturity' },
                    { text: 'None of the above, but I am applying for Registration Fee Only (no travel involved)', value: 'reg_only', next: 'maturity' },
                    { text: 'None of the above', value: 'none', ineligible: 'NUST conference travel sponsorship can be availed only once in a fiscal year. A second travel grant is only entertained if you meet the high-performance criteria (2x Q1 papers, or 1x Q1 paper + PKR 2M project, or a Best Performer Award). Note: multiple requests for registration fee only can be considered.', ref: 'Standard travel sponsorship is capped at once per fiscal year. To exceed this, researchers must demonstrate exceptional output (such as publishing multiple Q1 articles or securing a major PKR 2M project) within the same period.' }
                ]
            },
            {
                id: 'maturity',
                text: 'Is the conference at least in its 10th edition/maturity level?',
                desc: 'NUST only sponsors conferences with established standing.',
                options: [
                    { text: 'Yes, it is the 10th conference or later', value: 'yes', next: 'acceptance' },
                    { text: 'No, it is the 9th conference or earlier', value: 'no', ineligible: 'The maturity level (cardinality) of the conference should not be less than the 10th conference to qualify for NUST sponsorship.', ref: 'To ensure high academic standing and global visibility, NUST only sponsors presentations at established conferences that have successfully completed at least 9 previous editions.' }
                ]
            },
            {
                id: 'acceptance',
                text: 'What is the peer-review paper acceptance rate of the conference?',
                desc: 'Higher selectivity ensures sponsorship goes to quality venues.',
                options: [
                    { text: 'Less than 40%', value: 'low', next: 'indexing' },
                    { text: '40% or more, or not officially published/unknown', value: 'high', next: 'ranking' }
                ]
            },
            {
                id: 'ranking',
                text: 'Is the conference ranked in any of the following standard databases?',
                desc: 'If the acceptance rate is not available or is above 40%, rankings are used as an alternative.',
                options: [
                    { text: 'CORE Rankings: A or A*', value: 'core', next: 'indexing' },
                    { text: 'ABS Rankings: 4 or 4*', value: 'abs', next: 'indexing' },
                    { text: 'ABDC Rankings: A or A*', value: 'abdc', next: 'indexing' },
                    { text: 'None of the above', value: 'none', ineligible: 'To qualify for sponsorship, the conference must have an acceptance rate under 40%. In case of non-availability of acceptance rate, the conference must be ranked CORE A/A*, ABS 4/4*, or ABDC A/A*.', ref: 'Conferences must meet standard academic selectivity. If the acceptance rate is unknown or above 40%, the venue must be recognized in top-tier databases like CORE, ABS, or ABDC to qualify.' }
                ]
            },
            {
                id: 'indexing',
                text: 'Are the conference proceedings indexed in Scopus / Web of Science CPCI?',
                desc: 'Indexing ensures that your presented work will be globally discoverable.',
                options: [
                    { text: 'Yes, proceedings are indexed or will be published in an indexed journal', value: 'yes', next: 'predatory' },
                    { text: 'No, they are not indexed', value: 'no', ineligible: 'Current or previous proceedings of the conference must be indexed in Scopus or Web of Science (WoS) Conference Proceeding Citation Index (CPCI), or will be published in a WoS/Scopus indexed journal.', ref: 'Sponsorship requires that your paper will be indexed in Scopus or Web of Science (CPCI). This ensures your work is discoverable and contributes to the global citation ranking of NUST.' }
                ]
            },
            {
                id: 'predatory',
                text: 'Is the conference organized by any of the predatory organizers listed in policy?',
                desc: 'Predatory organizers (Conferences Series LLC, BIT Congress, SAI, OMICS, WASET, ISER, etc.) are strictly blacklisted.',
                options: [
                    { text: 'No, it is organized by a reputable professional body (IEEE, ACM, AAAS, AEA, etc.)', value: 'no', next: 'paper_type' },
                    { text: 'Yes, it is organized by a blacklisted/predatory organizer', value: 'yes', ineligible: 'Sponsorship cases for conferences organized by predatory organizers (such as Conference Series LLC, BIT Congress, SAI, OMICS, WASET, and ISER) will not be considered. Beall’s List of Predatory Conferences must be consulted.', ref: 'NUST strictly blacklists conferences organized by predatory publishers (like WASET, OMICS, or SAI) to protect researchers from low-quality academic venues.' }
                ]
            },
            {
                id: 'paper_type',
                text: 'What type of paper presentation has been accepted?',
                desc: 'Sponsorship is only for peer-reviewed oral presentations of full papers.',
                options: [
                    { text: 'Full-length article accepted for Oral Presentation', value: 'oral', next: 'lead_time' },
                    { text: 'Poster Presentation, Abstract-only, Keynote, or Attendance-only', value: 'other', ineligible: 'Only full-length articles accepted for Oral Presentation that have undergone peer review prior to the conference are eligible. Sponsorship is not provided for abstracts, poster presentations, keynote speakers, or attendance-only cases.', ref: 'Central funds are designated specifically for active oral presentations of peer-reviewed full-length articles. Abstracts, posters, and attendance-only do not qualify for central travel grants.' }
                ]
            },
            {
                id: 'lead_time',
                text: 'How many days in advance of the conference start date can you submit the case?',
                desc: 'The Research Directorate requires sufficient lead time to process the case and secure rector approval.',
                options: [
                    { text: '65 days or more', value: 'yes', eligible: true },
                    { text: 'Less than 65 days', value: 'no', ineligible: 'Duly completed application forms along with supporting documents must be received in the Research Directorate at least 65 days before the event. Late cases will not be entertained.', ref: 'Processing external travel requests requires routing through standard departmental reviews and rector approvals, which necessitates a minimum lead time of 65 days.' }
                ]
            }
        ],
        apc: [
            {
                id: 'quartile',
                text: 'What is the Web of Science (WoS) JCR quartile of the journal?',
                desc: 'NUST only sponsors APCs for journals ranked in Quartile 1 or Quartile 2.',
                options: [
                    { text: 'Quartile 1 (Q1)', value: 'q1', next: 'paper_type' },
                    { text: 'Quartile 2 (Q2)', value: 'q2', next: 'q2_limit' },
                    { text: 'ESCI (Emerging Sources Citation Index)', value: 'esci', ineligible: 'Papers published in ESCI (Emerging Sources Citation Index) Journals will not be eligible for publication charges sponsorship.', ref: 'NUST publication sponsorship is focused on high-impact journals ranked in Web of Science JCR Quartile 1 or 2. ESCI and unindexed journals do not qualify for Article Processing Charges.' },
                    { text: 'Quartile 3 (Q3) / Quartile 4 (Q4) / Unindexed', value: 'none', ineligible: 'Sponsorship for Article Processing Charges (APCs) is based on journal subject quartile rank. Only Quartile 1 and Quartile 2 articles are sponsored.', ref: 'Article Processing Charges (APC) are sponsored based on subject quartile rank. Only articles accepted in Q1 and Q2 journals are eligible.' }
                ]
            },
            {
                id: 'q2_limit',
                text: 'Have you already availed an APC sponsorship for a Q2 journal in this fiscal year?',
                desc: 'Faculty members are limited to a single Q2 sponsorship per fiscal year.',
                options: [
                    { text: 'No, this is my first Q2 case this fiscal year', value: 'no', next: 'paper_type' },
                    { text: 'Yes, I have already availed one Q2 sponsorship', value: 'yes', ineligible: 'For Quartile 2 articles, only one case per faculty member will be permitted for the Fiscal Year. A second Q2 case is not fully sponsored (author share will be cut).', ref: 'To ensure all faculty members have access to the APC pool, central sponsorship for Quartile 2 journals is limited to one paper per faculty member in any single fiscal year.' }
                ]
            },
            {
                id: 'paper_type',
                text: 'What is the format of your accepted paper?',
                desc: 'Only main scientific formats are eligible.',
                options: [
                    { text: 'Full-length research article or Review article', value: 'article', next: 'timing' },
                    { text: 'Short communication, letter, comment, or editorial', value: 'other', ineligible: 'Full-length research articles and review articles by NUST authors will be eligible for sponsorship. Other formats (short communication, letters, editorials, etc.) will not be sponsored.', ref: 'APC sponsorship is intended for primary scientific work published as full-length research or review articles. Short notes, letters, and editorials do not qualify.' }
                ]
            },
            {
                id: 'timing',
                text: 'Is the paper within 3 months of its acceptance date?',
                desc: 'Cases must be initiated promptly after paper acceptance.',
                options: [
                    { text: 'Yes, accepted less than 3 months ago', value: 'yes', next: 'lead_time' },
                    { text: 'No, accepted 3 months or more ago', value: 'no', ineligible: 'Articles will be eligible for publication charges sponsorship only if the case is sent within 3 months of the acceptance date. Any case sent later than 3 months will not be eligible.', ref: 'Applications for APC sponsorship must be submitted within 3 months of the official paper acceptance date to ensure timely budget planning and processing.' }
                ]
            },
            {
                id: 'lead_time',
                text: 'Can you submit the application at least 4 weeks before the payment due date?',
                desc: 'Processing payment invoices requires at least 4 weeks of administrative lead time.',
                options: [
                    { text: 'Yes, at least 4 weeks (28 days) in advance', value: 'yes', next: 'affirmations' },
                    { text: 'No, less than 4 weeks in advance', value: 'no', ineligible: 'The case for sponsorship of publication charges must be submitted on the prescribed form at least 4 weeks in advance of the payment due date for processing and approval.', ref: 'Sponsorship cases require a minimum of 4 weeks of administrative processing to review the invoice, confirm funding availability, and issue the bank transaction before the payment deadline.' }
                ]
            },
            {
                id: 'affirmations',
                text: 'Please confirm compliance with these administrative rules:',
                desc: 'All NUST guidelines must be ticked to proceed to the grant calculator.',
                type: 'affirmation',
                checkboxes: [
                    { id: 'aff_nust_name', text: 'My primary professional affiliation with NUST is shown on the research paper.' },
                    { id: 'aff_invoice_name', text: 'The journal invoice for payment is issued in the name of the NUST author.' },
                    { id: 'aff_nrp_upload', text: 'The research paper has been (or will be) uploaded to the NUST Research Portal (NRP) before submitting.' },
                    { id: 'aff_no_fa', text: 'I understand that faculty applying for publication charges (APC) will not be eligible for a publication cash financial award (FA) for the same paper.' }
                ],
                eligible: true
            }
        ],
        fa: [
            {
                id: 'quartile',
                text: 'What is the Web of Science (WoS) JCR quartile of the journal?',
                desc: 'NUST publication financial awards (FA) are given for papers published in Q1, Q2, or Q3 journals.',
                options: [
                    { text: 'Quartile 1 (Q1)', value: 'q1', next: 'paper_type' },
                    { text: 'Quartile 2 (Q2)', value: 'q2', next: 'paper_type' },
                    { text: 'Quartile 3 (Q3)', value: 'q3', next: 'school_check' },
                    { text: 'Quartile 4 (Q4), ESCI, or Unindexed Journal', value: 'other', ineligible: 'Financial awards (FA) are only provided for research papers published in Web of Science (WoS) JCR indexed impact factor journals in the Q1, Q2, and Q3 quartiles. ESCI, Q4, and unindexed journals are not eligible.', ref: 'Financial Awards are designed to incentivize high-quality research. Only papers published in impact factor journals ranked in JCR Quartiles 1, 2, or 3 qualify for the award.' }
                ]
            },
            {
                id: 'school_check',
                text: 'Which NUST School do you belong to?',
                desc: 'Q3 Financial Awards are restricted to specific schools. Only NLS and NSHS qualify.',
                options: [
                    { text: 'NLS (Natural & Life Sciences)', value: 'nls', next: 'paper_type' },
                    { text: 'NSHS (Social Sciences & Humanities)', value: 'nshs', next: 'paper_type' },
                    { text: 'Other School / Not listed', value: 'other', ineligible: 'Q3 Financial Awards are restricted to NLS (Natural & Life Sciences) and NSHS (Social Sciences & Humanities) schools only. Please consult your school\'s research office for alternative funding options.', ref: 'Per policy, Q3 awards are limited to NLS and NSHS to ensure targeted support for disciplines where Q3 represents impactful publication venues.' }
                ]
            },
            {
                id: 'paper_type',
                text: 'What format of research publication is this?',
                desc: 'Only full-length research articles are eligible. Review articles and minor formats are excluded.',
                options: [
                    { text: 'Full-length research article', value: 'article', next: 'timing' },
                    { text: 'Review article', value: 'review', ineligible: 'Review articles are not eligible for the Financial Award. Only full-length research articles qualify.', ref: 'Financial Awards are intended for original research contributions. Review articles, while valuable, do not qualify under this policy.' },
                    { text: 'Letter to the Editor, Editorial, Abstract, Comment, Errata, Book Chapter, or Conference Proceeding', value: 'other', ineligible: 'Letters to the editor, editorials, abstracts, comments, errata, PhD thesis books, and conference papers are not eligible for cash financial awards.', ref: 'Publication cash awards are reserved for peer-reviewed full research papers. Abstracts, conference proceedings, letters, errata, and comments are excluded.' }
                ]
            },
            {
                id: 'timing',
                text: 'Is this case being submitted within 12 weeks of the print publication date?',
                desc: 'The print publication date is when volume and issue numbers are officially assigned. Late cases are rejected.',
                options: [
                    { text: 'Yes, within 12 weeks of print publication', value: 'yes', next: 'affirmations' },
                    { text: 'No, more than 12 weeks have passed', value: 'no', ineligible: 'Applications for publication financial awards must be submitted to the Research Directorate within 12 weeks of the print publication date (including Volume and Issue numbers).', ref: 'Award cases must be submitted to the Research Directorate within 12 weeks of print publication (once volume, issue, and page numbers are assigned) to be eligible for processing.' }
                ]
            },
            {
                id: 'affirmations',
                text: 'Please confirm compliance with these administrative rules:',
                desc: 'All guidelines must be ticked to proceed to the publication award calculator.',
                type: 'affirmation',
                checkboxes: [
                    { id: 'aff_nust_name_fa', text: 'The paper is published under the primary affiliation: "National University of Sciences and Technology (NUST), Islamabad, Pakistan".' },
                    { id: 'aff_nrp_fa', text: 'The publication details have been successfully uploaded and approved on the NUST Research Portal (NRP).' },
                    { id: 'aff_no_apc_fa', text: 'No publication charges (APC) sponsorship or reimbursement was claimed from NUST for this paper (double claims are prohibited).' }
                ],
                eligible: true
            }
        ]
    },

    // Initialization
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.showHome();
        this.setTheme('dark'); // Default theme
    },

    cacheDom: function() {
        this.dom = {
            themeToggle: document.getElementById('theme-toggle'),
            landingView: document.getElementById('landing-view'),
            wizardView: document.getElementById('wizard-view'),
            resultView: document.getElementById('result-view'),
            
            // Stepper/Wizard
            currentFlowTitle: document.getElementById('current-flow-title'),
            stepIndicator: document.getElementById('step-indicator'),
            progressBar: document.getElementById('progress-bar'),
            questionCard: document.getElementById('question-card'),
            questionNumTag: document.getElementById('question-num-tag'),
            questionText: document.getElementById('question-text'),
            questionDesc: document.getElementById('question-desc'),
            answersContainer: document.getElementById('answers-container'),
            ineligibleCard: document.getElementById('ineligible-card'),
            ineligibleReasonText: document.getElementById('ineligible-reason-text'),
            policyClauseBox: document.getElementById('policy-clause-box'),
            policyClauseText: document.getElementById('policy-clause-text'),
            
            // Results
            resultFlowBadge: document.getElementById('result-flow-badge'),
            resultMainMessage: document.getElementById('result-main-message'),
            nextStepsList: document.getElementById('next-steps-list'),
            resultNoteText: document.getElementById('result-note-text'),
            
            // Calculator Panel
            calculatorPanel: document.getElementById('calculator-panel'),
            calculatorInputs: document.getElementById('calculator-inputs'),
            calcResultsTable: document.getElementById('calc-results-table'),
            calcGrandTotal: document.getElementById('calc-grand-total')
        };
    },

    bindEvents: function() {
        this.dom.themeToggle.addEventListener('click', () => {
            const newTheme = this.theme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });

        // Add visual tracking of cards hover effect coords
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--x', `${x}px`);
                card.style.setProperty('--y', `${y}px`);
            });
        });
    },

    setTheme: function(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        const icon = this.dom.themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    },

    showHome: function() {
        this.switchView('landingView');
        this.state.currentFlow = null;
        this.state.currentStep = 0;
        this.state.answers = {};
    },

    switchView: function(viewKey) {
        // Hide all views
        this.dom.landingView.classList.remove('active');
        this.dom.wizardView.classList.remove('active');
        this.dom.resultView.classList.remove('active');
        
        // Show target view
        this.dom[viewKey].classList.add('active');
    },

    startFlow: function(flowName) {
        this.state.currentFlow = flowName;
        this.state.currentStep = 0;
        this.state.answers = {};
        this.state.activeQuestions = this.questions[flowName];
        this.state.history = [];
        
        // Title mapping
        const titles = {
            conference: 'Conference Sponsorship Checklist',
            apc: 'APC Sponsorship Checklist',
            fa: 'Financial Award Checklist'
        };
        this.dom.currentFlowTitle.textContent = titles[flowName];
        
        this.dom.questionCard.classList.remove('hidden');
        this.dom.ineligibleCard.classList.add('hidden');
        
        this.switchView('wizardView');
        this.renderStep();
    },

    resetCurrentFlow: function() {
        this.startFlow(this.state.currentFlow);
    },

    renderStep: function() {
        const step = this.state.currentStep;
        const total = this.state.activeQuestions.length;
        const question = this.state.activeQuestions[step];
        
        // Update progress bar
        const percent = ((step + 0.5) / total) * 100;
        this.dom.progressBar.style.width = `${percent}%`;
        this.dom.stepIndicator.textContent = `Question ${step + 1} of ${total}`;
        
        // Show/hide previous question button
        const btnPrev = document.getElementById('btn-prev-question');
        if (btnPrev) {
            if (this.state.history && this.state.history.length > 0) {
                btnPrev.classList.remove('hidden');
            } else {
                btnPrev.classList.add('hidden');
            }
        }
        
        // Update question content
        this.dom.questionNumTag.textContent = `Q${step + 1}.`;
        this.dom.questionText.textContent = question.text;
        this.dom.questionDesc.textContent = question.desc || '';
        
        // Clear options
        this.dom.answersContainer.innerHTML = '';
        
        if (question.type === 'affirmation') {
            // Add NRP upload priority banner for APC flow
            if (this.state.currentFlow === 'apc') {
                const banner = document.createElement('div');
                banner.className = 'nrp-priority-banner';
                banner.innerHTML = `<i class="fa-solid fa-upload"></i> <strong>IMPORTANT:</strong> Uploading your manuscript to the NUST Research Portal (NRP) is the highest priority step and must be completed before processing your case.`;
                this.dom.answersContainer.appendChild(banner);
            }
            
            // Render affirmation checkboxes
            question.checkboxes.forEach((cb, idx) => {
                const item = document.createElement('div');
                item.className = `checkbox-option ${cb.id === 'aff_nrp_upload' ? 'checkbox-highlight' : ''}`;
                item.innerHTML = `
                    <input type="checkbox" id="${cb.id}" data-index="${idx}" onchange="app.handleCheckboxChange(this)">
                    <label class="checkbox-label" for="${cb.id}">${cb.text}</label>
                `;
                this.dom.answersContainer.appendChild(item);
            });
            
            // Add submit button
            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn btn-primary btn-submit-assertions';
            submitBtn.id = 'submit-assertions-btn';
            submitBtn.disabled = true;
            submitBtn.innerHTML = `Continue <i class="fa-solid fa-arrow-right"></i>`;
            submitBtn.onclick = () => this.handleAffirmationSubmit(question);
            this.dom.answersContainer.appendChild(submitBtn);
        } else {
            // Render standard multiple choice options
            question.options.forEach((opt, idx) => {
                const btn = document.createElement('button');
                btn.className = 'btn-option';
                btn.innerHTML = `
                    <span>${opt.text}</span>
                    <i class="fa-solid fa-chevron-right"></i>
                `;
                btn.onclick = () => this.handleOptionClick(opt);
                this.dom.answersContainer.appendChild(btn);
            });
        }
    },

    handleCheckboxChange: function(checkbox) {
        const optionBox = checkbox.closest('.checkbox-option');
        if (checkbox.checked) {
            optionBox.classList.add('checked');
        } else {
            optionBox.classList.remove('checked');
        }
        
        // Check if all checkboxes in step are ticked
        const allCheckboxes = this.dom.answersContainer.querySelectorAll('input[type="checkbox"]');
        const submitBtn = document.getElementById('submit-assertions-btn');
        let allChecked = true;
        allCheckboxes.forEach(cb => {
            if (!cb.checked) allChecked = false;
        });
        
        submitBtn.disabled = !allChecked;
    },

    handleAffirmationSubmit: function(question) {
        // All affirmations verified, proceed
        if (question.eligible) {
            this.evaluateEligibility();
        } else if (question.next) {
            this.state.history.push(this.state.currentStep);
            this.state.currentStep = this.state.activeQuestions.findIndex(q => q.id === question.next);
            this.renderStep();
        }
    },

    handleOptionClick: function(option) {
        // Store answer
        const currentQ = this.state.activeQuestions[this.state.currentStep];
        this.state.answers[currentQ.id] = option.value;
        
        // Check if option triggers ineligibility
        if (option.ineligible) {
            this.showIneligible(option.ineligible, option.ref);
            return;
        }
        
        // Handle next step
        if (option.eligible) {
            this.evaluateEligibility();
        } else if (option.next) {
            // Find index of next question
            const nextIdx = this.state.activeQuestions.findIndex(q => q.id === option.next);
            if (nextIdx !== -1) {
                this.state.history.push(this.state.currentStep);
                this.state.currentStep = nextIdx;
                this.renderStep();
            } else {
                console.error(`Next question ID '${option.next}' not found.`);
                this.showHome();
            }
        }
    },

    showIneligible: function(reasonText, refClause) {
        // Animate progression of progress bar to full on failure
        this.dom.progressBar.style.width = '100%';
        
        this.dom.ineligibleReasonText.textContent = reasonText;
        if (refClause) {
            this.dom.policyClauseBox.classList.remove('hidden');
            // Convert ref text to clickable link based on flow
            const policyUrls = {
                conference: 'https://drive.google.com/file/d/12ayKPwL6wS1Aa16DVSdMb4MIWiwPk290/view',
                apc: 'https://drive.google.com/file/d/1uVr-ZmnyCxOEbYfJ8WyvT32-GIEvjFtX/view',
                fa: 'https://drive.google.com/file/d/1R6-IJMU6r7rKjJndcZ4ak5g-Nzp93PCD/view'
            };
            const url = policyUrls[this.state.currentFlow] || '#';
            this.dom.policyClauseText.innerHTML = `<a href="${url}" target="_blank" class="policy-ref-link"><i class="fa-regular fa-file-pdf"></i> ${refClause}</a>`;
        } else {
            this.dom.policyClauseBox.classList.add('hidden');
        }
        
        this.dom.questionCard.classList.add('hidden');
        this.dom.ineligibleCard.classList.remove('hidden');

        // Show prev question button even on ineligible card
        const btnPrev = document.getElementById('btn-prev-question');
        if (btnPrev) {
            btnPrev.classList.remove('hidden');
        }
    },

    goBack: function() {
        if (!this.dom.ineligibleCard.classList.contains('hidden')) {
            this.dom.ineligibleCard.classList.add('hidden');
            this.dom.questionCard.classList.remove('hidden');
            this.renderStep();
        } else if (this.state.history && this.state.history.length > 0) {
            const prevStep = this.state.history.pop();
            const currentQ = this.state.activeQuestions[this.state.currentStep];
            if (currentQ) {
                delete this.state.answers[currentQ.id];
            }
            this.state.currentStep = prevStep;
            this.renderStep();
        }
    },

    evaluateEligibility: function() {
        const flow = this.state.currentFlow;
        
        // Update badge
        const badgeNames = {
            conference: 'Conference Sponsorship',
            apc: 'Article Processing Charges',
            fa: 'Financial Award'
        };
        this.dom.resultFlowBadge.textContent = badgeNames[flow];
        
        // Reset dynamic panels
        this.dom.calculatorPanel.classList.add('hidden');
        this.dom.nextStepsList.innerHTML = '';
        
        if (flow === 'conference') {
            this.dom.resultMainMessage.textContent = 'You satisfy all basic requirements for NUST Conference Sponsorship!';
            this.dom.resultNoteText.textContent = 'Make sure to submit HEC travel grant documents at least 65 days prior to the conference date.';
            
            // Build checklist
            const steps = [
                'First, complete and submit your Travel Grant Application to HEC (TGPR portal) & PSF. You must apply for external funding before NUST.',
                'Prepare the NUST Sponsorship Application Form (WP No. 68 Appendix 2) along with Turnitin report (< 15% similarity), conference acceptance email/letter, and 3 airfare quotations.',
                'Submit the complete case via NUST eMinute sheet to the Research Directorate at least 65 days before the event.',
                'Ensure the conference paper is uploaded on the NUST Research Portal (NRP) before initiating the case.',
                'Post-Travel: Submit a Post-Visit Report (Appendix 3) and original boarding passes/invoices within 10 days of your return for reimbursement.'
            ];
            
            // Special modification for MS student
            if (this.state.answers['role'] === 'ms') {
                this.dom.resultMainMessage.textContent = 'You are eligible for Conference Registration Fee Sponsorship only!';
                steps.unshift('NOTE: As an MS Student, you are eligible for conference registration fee sponsorship only (up to USD 700). NUST travel grant (airfare, accommodation, TA/DA) is not applicable.');
            }
            
            steps.forEach(step => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${step}</span>`;
                this.dom.nextStepsList.appendChild(li);
            });
            
        } else if (flow === 'apc') {
            this.dom.resultMainMessage.textContent = 'You are eligible for NUST Article Processing Charges (APC) Sponsorship!';
            this.dom.resultNoteText.textContent = 'Initiate the eMinute case at least 4 weeks in advance of the payment deadline.';
            
            const steps = [
                'Prepare NUST APC Application Form (WP No. 66 Appendix A).',
                'Attach the official acceptance letter/email showing the acceptance date.',
                'Attach the official invoice issued in the name of the NUST author.',
                'Upload the manuscript to the NUST Research Portal (NRP) and confirm the approval.',
                'Initiate the case through NUST eMinute sheet to the Research Directorate at least 4 weeks prior to the payment due date.'
            ];
            steps.forEach(step => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${step}</span>`;
                this.dom.nextStepsList.appendChild(li);
            });
            
            // Initialize APC Calculator
            this.setupAPCCalculator();
            this.dom.calculatorPanel.classList.remove('hidden');
            
        } else if (flow === 'fa') {
            this.dom.resultMainMessage.textContent = 'You are eligible for the NUST Financial Publication Award!';
            this.dom.resultNoteText.textContent = 'Submit your award application within 12 weeks of print publication.';
            
            const steps = [
                'Verify that your publication appears on the NUST Research Portal (NRP) and is approved.',
                'Fill out the NUST Publication Financial Award Application Form.',
                'Attach the PDF of the published paper clearly showing NUST, Islamabad affiliation.',
                'Attach a Turnitin similarity report verified by HOD.',
                'Submit the case to your school/college HOD Research for endorsement, which will be forwarded to the Research Directorate.'
            ];
            steps.forEach(step => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fa-solid fa-check-circle"></i> <span>${step}</span>`;
                this.dom.nextStepsList.appendChild(li);
            });
            
            // Initialize FA Calculator
            this.setupFACalculator();
            this.dom.calculatorPanel.classList.remove('hidden');
        }
        
        this.switchView('resultView');
    },

    // --- APC CALCULATOR LOGIC ---
    setupAPCCalculator: function() {
        const quartile = this.state.answers['quartile'] || 'q1';
        
        this.dom.calculatorInputs.innerHTML = `
            <div class="input-group">
                <label for="apc-quartile">Journal Quartile</label>
                <div class="input-wrapper">
                    <select id="apc-quartile" onchange="app.updateAPCCalculation()">
                        <option value="q1" ${quartile === 'q1' ? 'selected' : ''}>Quartile 1 (Q1) - Limit $1,800</option>
                        <option value="q2" ${quartile === 'q2' ? 'selected' : ''}>Quartile 2 (Q2) - Limit $1,200</option>
                    </select>
                </div>
            </div>
            
            <div class="input-group">
                <div class="input-label-row">
                    <label for="apc-fee">Actual Publication Fee (USD)</label>
                    <span class="input-info-text" id="apc-fee-limit">Max: $1,800</span>
                </div>
                <div class="input-wrapper prefixed">
                    <span class="input-prefix">$</span>
                    <input type="number" id="apc-fee" value="1500" min="0" max="1800" oninput="app.updateAPCCalculation()">
                </div>
            </div>
            
            <div class="input-group">
                <label for="apc-rate">Exchange Rate (PKR / USD)</label>
                <div class="input-wrapper">
                    <input type="number" id="apc-rate" value="278.0" min="1" step="0.1" oninput="app.updateAPCCalculation()">
                </div>
            </div>
            
            <div class="input-group">
                <div class="input-label-row">
                    <label>Authorship Structure</label>
                    <span class="author-count-badge" id="apc-author-count-label">3 Authors</span>
                </div>
                <div class="input-wrapper">
                    <select id="apc-author-count" onchange="app.handleAPCAuthorCountChange()">
                        <option value="1">1 (Sole Author)</option>
                        <option value="2">2 Authors</option>
                        <option value="3" selected>3 Authors</option>
                        <option value="4">4 Authors</option>
                        <option value="5">5 or more Authors</option>
                    </select>
                </div>
                
                <div class="author-builder">
                    <div class="author-list" id="apc-author-list">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        this.handleAPCAuthorCountChange();
    },

    handleAPCAuthorCountChange: function() {
        const countSelect = document.getElementById('apc-author-count');
        let count = parseInt(countSelect.value);
        const container = document.getElementById('apc-author-list');
        const countLabel = document.getElementById('apc-author-count-label');
        
        countLabel.textContent = count === 5 ? '5 or more Authors' : `${count} ${count === 1 ? 'Author' : 'Authors'}`;
        
        // Save old values if any
        const oldState = [];
        container.querySelectorAll('.author-row').forEach(row => {
            const idx = parseInt(row.dataset.index);
            const isNust = row.querySelector('.cb-nust').checked;
            const isCorr = row.querySelector('.cb-corr').checked;
            oldState[idx] = { isNust, isCorr };
        });
        
        container.innerHTML = '';
        
        // Total rows to render in UI. Let's render max 5 rows.
        const rowsToRender = Math.max(count, 4);
        
        for (let i = 0; i < rowsToRender; i++) {
            const authorNum = i + 1;
            const isNustDefault = i === 0; // default 1st author is NUST
            const isCorrDefault = i === 0; // default 1st author is corresponding
            
            const saved = oldState[i] || { isNust: isNustDefault, isCorr: isCorrDefault };
            
            // If i >= count, this author is omitted from total count, but rendered as grayed/inactive if count < 4
            const isInactive = i >= count;
            
            const row = document.createElement('div');
            row.className = `author-row ${isInactive ? 'faded' : ''}`;
            row.dataset.index = i;
            
            row.innerHTML = `
                <span class="author-name-label">${i === 0 ? '1st Author' : i === 1 ? '2nd Author' : i === 2 ? '3rd Author' : i === 3 ? '4th Author' : `${authorNum}th Author`}</span>
                <label class="author-cb-label">
                    <input type="checkbox" class="cb-nust" ${saved.isNust ? 'checked' : ''} ${isInactive ? 'disabled' : ''} onchange="app.handleAuthorCheckChange(${i}, 'nust')">
                    NUST Auth
                </label>
                <label class="author-cb-label">
                    <input type="checkbox" class="cb-corr" ${saved.isCorr ? 'checked' : ''} ${isInactive ? 'disabled' : ''} onchange="app.handleAuthorCheckChange(${i}, 'corr')">
                    Corr. Auth
                </label>
            `;
            container.appendChild(row);
        }
        
        this.updateAPCCalculation();
    },

    handleAuthorCheckChange: function(index, type) {
        // Enforce only one corresponding author for simplicity (toggle others off)
        if (type === 'corr') {
            const listSelector = this.state.currentFlow === 'fa' ? '#fa-author-list' : '#apc-author-list';
            const corrCbs = document.querySelectorAll(`${listSelector} .cb-corr`);
            corrCbs.forEach((cb, idx) => {
                if (idx !== index) cb.checked = false;
            });
        }
        
        if (this.state.currentFlow === 'fa') {
            this.updateFACalculation();
        } else {
            this.updateAPCCalculation();
        }
    },

    updateAPCCalculation: function() {
        const quartile = document.getElementById('apc-quartile').value;
        const limit = quartile === 'q1' ? 1800 : 1200;
        const feeInput = document.getElementById('apc-fee');
        const feeLimitLabel = document.getElementById('apc-fee-limit');
        
        // Enforce max limit
        feeInput.max = limit;
        feeLimitLabel.textContent = `Max: $${limit.toLocaleString()}`;
        if (parseFloat(feeInput.value) > limit) {
            feeInput.value = limit;
        }
        
        const actualFee = parseFloat(feeInput.value) || 0;
        const exchangeRate = parseFloat(document.getElementById('apc-rate').value) || 278.0;
        const authorCount = parseInt(document.getElementById('apc-author-count').value);
        
        // Get author state
        const authors = [];
        const rows = document.querySelectorAll('#apc-author-list .author-row');
        rows.forEach(row => {
            const idx = parseInt(row.dataset.index);
            if (idx < authorCount) {
                const isNust = row.querySelector('.cb-nust').checked;
                const isCorr = row.querySelector('.cb-corr').checked;
                authors.push({ isNust, isCorr, originalIndex: idx });
            }
        });
        
        // Quartile limits
        const totalSponsoredFeeUSD = Math.min(actualFee, limit);
        const totalSponsoredFeePKR = totalSponsoredFeeUSD * exchangeRate;
        
        // Solve NUST authors shares
        const results = this.calculateAuthorShares(authors, authorCount);
        const totalNustPercentage = results.nustTotalPercentage;
        
        const nustAmountUSD = totalSponsoredFeeUSD * (totalNustPercentage / 100);
        const nustAmountPKR = nustAmountUSD * exchangeRate;
        
        // Build rows for individual NUST authors
        let authorRowsHTML = '';
        const ordinalNames = ['1st Author', '2nd Author', '3rd Author', '4th Author', '5th Author', '6th Author'];
        results.individualShares.forEach(share => {
            const authorShareUSD = totalSponsoredFeeUSD * (share.sharePercentage / 100);
            const authorSharePKR = authorShareUSD * exchangeRate;
            
            // Mention if shifted position
            const positionText = share.originalIndex !== share.revisedIndex
                ? `${ordinalNames[share.originalIndex]} (moved to 2nd position)`
                : `${ordinalNames[share.originalIndex]}`;
                
            authorRowsHTML += `
                <div class="results-row" style="padding-left: 1rem; font-size: 0.8rem; opacity: 0.85;">
                    <span>&bull; ${positionText}:</span>
                    <span>${share.sharePercentage}% &rarr; $${authorShareUSD.toFixed(1)} USD (Rs. ${Math.round(authorSharePKR).toLocaleString()})</span>
                </div>
            `;
        });
        
        // Render results table
        this.dom.calcResultsTable.innerHTML = `
            <div class="results-row">
                <span>Journal Quartile Limit:</span>
                <span>$${limit.toLocaleString()} USD</span>
            </div>
            <div class="results-row">
                <span>Eligible Publication Fee:</span>
                <span>$${totalSponsoredFeeUSD.toLocaleString()} USD (Rs. ${Math.round(totalSponsoredFeePKR).toLocaleString()})</span>
            </div>
            <div class="results-row highlighted">
                <span>NUST Authors Share Breakdown:</span>
                <span>${totalNustPercentage}%</span>
            </div>
            ${authorRowsHTML || '<div class="results-row" style="padding-left: 1rem; font-size: 0.8rem; opacity: 0.85;"><span>No NUST Authors selected</span></div>'}
            <div class="results-row">
                <span>Exchange Rate:</span>
                <span>1 USD = Rs. ${exchangeRate.toFixed(1)}</span>
            </div>
        `;
        
        // Grand Total Box
        this.dom.calcGrandTotal.textContent = `Rs. ${Math.round(nustAmountPKR).toLocaleString()}/-`;
    },

    // --- FA CALCULATOR LOGIC ---
    setupFACalculator: function() {
        const quartile = this.state.answers['quartile'] || 'q1';
        const quartileLabel = quartile === 'q1' ? 'Q1' : quartile === 'q2' ? 'Q2' : 'Q3';
        
        this.dom.calculatorInputs.innerHTML = `
            <div class="input-group">
                <label for="fa-quartile">Journal Quartile</label>
                <div class="input-wrapper">
                    <select id="fa-quartile" onchange="app.updateFACalculation()">
                        <option value="q1" ${quartile === 'q1' ? 'selected' : ''}>Quartile 1 (Q1)</option>
                        <option value="q2" ${quartile === 'q2' ? 'selected' : ''}>Quartile 2 (Q2)</option>
                        <option value="q3" ${quartile === 'q3' ? 'selected' : ''}>Quartile 3 (Q3)</option>
                    </select>
                </div>
            </div>

            <div class="calc-divider"></div>
            
            <div class="input-group">
                <div class="input-label-row">
                    <label for="fa-tj">Total Journals in Category (TJ)</label>
                    <input type="number" id="fa-tj-val" class="slider-val-input" min="2" max="1000" value="100" oninput="app.handleManualTJInput(this)" onblur="app.updateFACalculation()">
                </div>
                <div class="slider-container">
                    <input type="range" id="fa-tj" min="2" max="1000" value="100" class="custom-slider" oninput="app.updateFACalculation()">
                    <div class="slider-labels">
                        <span>Min (2)</span>
                        <span>Max (1000)</span>
                    </div>
                </div>
            </div>
            
            <div class="input-group">
                <div class="input-label-row">
                    <label for="fa-pj">Journal Position in Category (PJ)</label>
                    <input type="number" id="fa-pj-val" class="slider-val-input" min="1" max="1000" value="10" oninput="app.handleManualPJInput(this)" onblur="app.updateFACalculation()">
                </div>
                <div class="slider-container">
                    <input type="range" id="fa-pj" min="1" max="1000" value="10" class="custom-slider" oninput="app.updateFACalculation()">
                    <div class="slider-labels">
                        <span>Best (1)</span>
                        <span>Worst (TJ)</span>
                    </div>
                </div>
            </div>
            
            <div class="input-group">
                <div class="input-label-row">
                    <label>Authorship Structure</label>
                    <span class="author-count-badge" id="fa-author-count-label">3 Authors</span>
                </div>
                <div class="input-wrapper">
                    <select id="fa-author-count" onchange="app.handleFAAuthorCountChange()">
                        <option value="1">1 (Sole Author)</option>
                        <option value="2">2 Authors</option>
                        <option value="3" selected>3 Authors</option>
                        <option value="4">4 Authors</option>
                        <option value="5">5 or more Authors</option>
                    </select>
                </div>
                
                <div class="input-group" id="fa-total-author-group" style="display:none;">
                    <div class="input-label-row">
                        <label for="fa-total-author-count">Total Number of Authors</label>
                        <span class="input-info-text">Max 10</span>
                    </div>
                    <div class="input-wrapper">
                        <input type="number" id="fa-total-author-count" min="5" max="10" value="5" oninput="app.handleFAAuthorCountChange()">
                    </div>
                </div>
                
                <div class="author-builder">
                    <div class="author-list" id="fa-author-list">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            </div>
        `;
        
        this.handleFAAuthorCountChange();
    },

    getFAAuthorCount: function() {
        const selectVal = parseInt(document.getElementById('fa-author-count').value);
        if (selectVal !== 5) return selectVal;
        const input = document.getElementById('fa-total-author-count');
        let n = parseInt(input.value);
        if (isNaN(n)) n = 5;
        n = Math.max(5, Math.min(10, n));
        input.value = n;
        return n;
    },

    handleFAAuthorCountChange: function() {
        const countSelect = document.getElementById('fa-author-count');
        const selectVal = parseInt(countSelect.value);
        const count = selectVal === 5 ? this.getFAAuthorCount() : selectVal;
        const container = document.getElementById('fa-author-list');
        const countLabel = document.getElementById('fa-author-count-label');
        const totalAuthorGroup = document.getElementById('fa-total-author-group');
        if (totalAuthorGroup) totalAuthorGroup.style.display = selectVal === 5 ? 'block' : 'none';
        
        countLabel.textContent = count === 1 ? '1 Author' : `${count} Authors`;
        
        // Save old values if any
        const oldState = [];
        container.querySelectorAll('.author-row').forEach(row => {
            const idx = parseInt(row.dataset.index);
            const isNust = row.querySelector('.cb-nust').checked;
            const isCorr = row.querySelector('.cb-corr').checked;
            oldState[idx] = { isNust, isCorr };
        });
        
        container.innerHTML = '';
        
        const rowsToRender = Math.max(count, 4);
        
        for (let i = 0; i < rowsToRender; i++) {
            const authorNum = i + 1;
            const isNustDefault = i === 0;
            const isCorrDefault = i === 0;
            
            const saved = oldState[i] || { isNust: isNustDefault, isCorr: isCorrDefault };
            const isInactive = i >= count;
            
            const row = document.createElement('div');
            row.className = `author-row ${isInactive ? 'faded' : ''}`;
            row.dataset.index = i;
            
            row.innerHTML = `
                <span class="author-name-label">${i === 0 ? '1st Author' : i === 1 ? '2nd Author' : i === 2 ? '3rd Author' : i === 3 ? '4th Author' : `${authorNum}th Author`}</span>
                <label class="author-cb-label">
                    <input type="checkbox" class="cb-nust" ${saved.isNust ? 'checked' : ''} ${isInactive ? 'disabled' : ''} onchange="app.handleAuthorCheckChange(${i}, 'nust')">
                    NUST Auth
                </label>
                <label class="author-cb-label">
                    <input type="checkbox" class="cb-corr" ${saved.isCorr ? 'checked' : ''} ${isInactive ? 'disabled' : ''} onchange="app.handleAuthorCheckChange(${i}, 'corr')">
                    Corr. Auth
                </label>
            `;
            container.appendChild(row);
        }
        
        this.updateFACalculation();
    },

    handleManualTJInput: function(input) {
        const slider = document.getElementById('fa-tj');
        const pjSlider = document.getElementById('fa-pj');
        const pjInput = document.getElementById('fa-pj-val');
        let val = parseInt(input.value);
        if (isNaN(val)) return;
        
        if (val < 2) val = 2;
        if (val > 1000) val = 1000;
        
        slider.value = val;
        
        // Enforce PJ <= TJ
        pjSlider.max = val;
        if (pjInput) pjInput.max = val;
        let pjVal = parseInt(pjSlider.value);
        if (pjVal > val) {
            pjSlider.value = val;
            if (pjInput) pjInput.value = val;
        }
        
        this.updateFACalculation();
    },

    handleManualPJInput: function(input) {
        const slider = document.getElementById('fa-pj');
        const tjSlider = document.getElementById('fa-tj');
        let tj = parseInt(tjSlider.value);
        let val = parseInt(input.value);
        if (isNaN(val)) return;
        
        if (val < 1) val = 1;
        if (val > tj) val = tj;
        
        slider.value = val;
        this.updateFACalculation();
    },

    updateFACalculation: function() {
        const quartile = document.getElementById('fa-quartile').value;
        
        const tjSlider = document.getElementById('fa-tj');
        const pjSlider = document.getElementById('fa-pj');
        const authorCount = this.getFAAuthorCount();
        
        let tj = parseInt(tjSlider.value);
        let pj = parseInt(pjSlider.value);
        
        // Enforce that PJ <= TJ
        pjSlider.max = tj;
        if (pj > tj) {
            pj = tj;
            pjSlider.value = tj;
        }
        
        // Percentile is computed from TJ/PJ (1 - PJ/TJ)
        const percentile = tj > 0 ? 1 - (pj / tj) : 0;
        const percentilePct = percentile * 100;
        
        // Update value displays (if not active element to prevent cursor jump)
        const tjValEl = document.getElementById('fa-tj-val');
        const pjValEl = document.getElementById('fa-pj-val');
        if (tjValEl && document.activeElement !== tjValEl) tjValEl.value = tj;
        if (pjValEl && document.activeElement !== pjValEl) pjValEl.value = pj;
        
        // Get author state
        const authors = [];
        const rows = document.querySelectorAll('#fa-author-list .author-row');
        rows.forEach(row => {
            const idx = parseInt(row.dataset.index);
            if (idx < authorCount) {
                const isNust = row.querySelector('.cb-nust').checked;
                const isCorr = row.querySelector('.cb-corr').checked;
                authors.push({ isNust, isCorr, originalIndex: idx });
            }
        });
        
        // Determine formula constants based on quartile
        let formulaBase = 0, formulaMultiplier = 0;
        if (quartile === 'q1') {
            formulaBase = 40000;
            formulaMultiplier = 60000;
        } else if (quartile === 'q2') {
            formulaBase = 35000;
            formulaMultiplier = 20000;
        } else { // q3
            formulaBase = 20000;
            formulaMultiplier = 5000;
        }
        
        // Calculate base award — Q1 percentile tiers via 1 - PJ/TJ, otherwise TJ/PJ formula
        let baseAward = 0;
        let percentileNote = '';
        if (quartile === 'q1' && tj > 1) {
            if (percentile >= 0.95) {
                baseAward = 150000;
                percentileNote = ' (≥95th percentile → fixed Rs. 150,000)';
            } else if (percentile >= 0.90) {
                baseAward = 120000;
                percentileNote = ' (≥90th percentile → fixed Rs. 120,000)';
            } else {
                baseAward = formulaBase + formulaMultiplier * ((tj - pj) / (tj - 1));
            }
        } else if (tj > 1) {
            baseAward = formulaBase + formulaMultiplier * ((tj - pj) / (tj - 1));
        } else {
            baseAward = formulaBase + formulaMultiplier;
        }
        
        // Authorship split calculations
        const results = this.calculateAuthorShares(authors, authorCount);
        const totalNustPercentage = results.nustTotalPercentage;
        
        const nustAwardAmount = baseAward * (totalNustPercentage / 100);
        
        // Build rows for individual NUST authors
        let authorRowsHTML = '';
        const ordinalNames = ['1st Author', '2nd Author', '3rd Author', '4th Author', '5th Author', '6th Author', '7th Author', '8th Author', '9th Author', '10th Author'];
        results.individualShares.forEach(share => {
            const authorSharePKR = baseAward * (share.sharePercentage / 100);
            
            // Mention if shifted position
            const positionText = share.originalIndex !== share.revisedIndex
                ? `${ordinalNames[share.originalIndex]} (moved to 2nd position)`
                : `${ordinalNames[share.originalIndex]}`;
                
            authorRowsHTML += `
                <div class="results-row" style="padding-left: 1rem; font-size: 0.8rem; opacity: 0.85;">
                    <span>&bull; ${positionText}:</span>
                    <span>${share.sharePercentage}% &rarr; Rs. ${Math.round(authorSharePKR).toLocaleString()}/-</span>
                </div>
            `;
        });
        
        // Quartile labels
        const qLabels = { q1: 'Q1', q2: 'Q2', q3: 'Q3' };
        
        // Render results table
        this.dom.calcResultsTable.innerHTML = `
            <div class="results-row">
                <span>Journal Quartile:</span>
                <span>${qLabels[quartile] || quartile}</span>
            </div>
            <div class="results-row">
                <span>Journal Position Index:</span>
                <span>${pj} / ${tj}</span>
            </div>
            <div class="results-row">
                <span>Journal Percentile:</span>
                <span>${percentilePct.toFixed(1)}%${percentileNote}</span>
            </div>
            <div class="results-row highlighted">
                <span>Base Publication Award:</span>
                <span>Rs. ${Math.round(baseAward).toLocaleString()}/-</span>
            </div>
            <div class="results-row highlighted">
                <span>NUST Authors Share Breakdown:</span>
                <span>${totalNustPercentage}%</span>
            </div>
            ${authorRowsHTML || '<div class="results-row" style="padding-left: 1rem; font-size: 0.8rem; opacity: 0.85;"><span>No NUST Authors selected</span></div>'}
        `;
        
        // Grand Total Box
        this.dom.calcGrandTotal.textContent = `Rs. ${Math.round(nustAwardAmount).toLocaleString()}/-`;
    },

    // --- AUTHORS SHARE COMPUTATION UTILITY ---
    calculateAuthorShares: function(authors, authorCount) {
        // Build revised author order array
        let revisedAuthors = [...authors];
        
        // Rule: Corresponding author from NUST
        // For FA, if not among the first two authors (index >= 2), moved to 2nd position (index 1)
        // For APC, if not among the first four authors (index >= 4), moved to 2nd position (index 1)
        const corrIdx = revisedAuthors.findIndex(a => a.isCorr && a.isNust);
        const threshold = this.state.currentFlow === 'fa' ? 2 : 4;
        if (corrIdx >= threshold) {
            // Remove the corresponding author from their old position and place them at index 1 (2nd author position)
            const corrAuth = revisedAuthors.splice(corrIdx, 1)[0];
            revisedAuthors.splice(1, 0, corrAuth);
        }
        
        // Authorship split percentage table (Sole, 2, 3, 4)
        const shareTables = {
            1: [100],
            2: [60, 40],
            3: [50, 35, 15],
            4: [45, 30, 15, 10]
        };
        
        const isFA = this.state.currentFlow === 'fa';
        let shareTable;
        let calcCount;
        let assignByNustOrder = false;
        if (isFA) {
            if (authorCount <= 4) {
                // Base tables by total author count
                shareTable = [...(shareTables[authorCount] || shareTables[4])];
                calcCount = authorCount;
            } else {
                // 5 or more authors
                const nustInFirst4 = revisedAuthors.slice(0, 4).filter(a => a.isNust).length;
                const totalNust = revisedAuthors.filter(a => a.isNust).length;
                if (nustInFirst4 <= 1) {
                    // 0 or 1 NUST author in the first 4 positions → positional table
                    shareTable = [70, 60, 40];
                    for (let i = 3; i < authorCount; i++) shareTable.push(10);
                    calcCount = authorCount;
                } else {
                    // 2+ NUST authors in first 4 → table by total NUST count,
                    // assigned to NUST authors in order of appearance
                    if (totalNust >= 4) {
                        shareTable = [45, 30, 15, 10];
                    } else if (totalNust === 3) {
                        shareTable = [50, 35, 15];
                    } else {
                        shareTable = [60, 40];
                    }
                    calcCount = authorCount;
                    assignByNustOrder = true;
                }
            }
        } else {
            // APC: unchanged — capped at first 4 authors
            calcCount = Math.min(authorCount, 4);
            shareTable = shareTables[calcCount] || shareTables[4];
        }
        
        let nustTotalPercentage = 0;
        let breakdownParts = [];
        let individualShares = [];
        
        let nustCounter = 0;
        for (let i = 0; i < calcCount; i++) {
            const author = revisedAuthors[i];
            if (author && author.isNust) {
                const share = assignByNustOrder
                    ? (shareTable[nustCounter] || 0)
                    : (shareTable[i] || 0);
                if (assignByNustOrder) nustCounter++;
                
                nustTotalPercentage += share;
                
                // Track original author names/indexes for the text breakdown
                const originalNum = author.originalIndex + 1;
                breakdownParts.push(`Author ${originalNum} (${share}%)`);
                
                individualShares.push({
                    originalIndex: author.originalIndex,
                    revisedIndex: i,
                    sharePercentage: share
                });
            }
        }
        
        const sharesBreakdownText = breakdownParts.length > 0 
            ? breakdownParts.join(' + ') 
            : 'No NUST Authors selected';
            
        return {
            nustTotalPercentage,
            sharesBreakdownText,
            individualShares
        };
    }
};

// Initialize App when DOM Content is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
