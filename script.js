document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Set Copyright Year ---
    document.getElementById('year').textContent = new Date().getFullYear();

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // --- 3. Sticky Header & Scroll to Top ---
    const header = document.getElementById('header');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 4. Scroll Reveal Animation ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
    revealElements.forEach(el => revealObserver.observe(el));

    // --- 5. Counter Animation ---
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const counterSection = document.querySelector('.why-us');
    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !hasCounted) {
            runCounters();
            hasCounted = true;
        }
    }, { threshold: 0.5 });
    
    if(counterSection) counterObserver.observe(counterSection);

    // --- 6. FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-question');
    
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all answers
            faqItems.forEach(btn => {
                btn.classList.remove('active');
                btn.nextElementSibling.style.maxHeight = null;
            });

            // If it wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const answer = item.nextElementSibling;
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- 7. EMI Calculator Logic ---
    const amtRange = document.getElementById('emi-amount-range');
    const amtInput = document.getElementById('emi-amount');
    const rateRange = document.getElementById('emi-rate-range');
    const rateInput = document.getElementById('emi-rate');
    const tenureRange = document.getElementById('emi-tenure-range');
    const tenureInput = document.getElementById('emi-tenure');
    
    const displayEmi = document.getElementById('calc-emi');
    const displayInterest = document.getElementById('calc-interest');

    const formatCurrency = (num) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(num);
    };

    const calculateEMI = () => {
        let p = parseFloat(amtInput.value);
        let r = parseFloat(rateInput.value) / 12 / 100;
        let n = parseFloat(tenureInput.value) * 12;

        if (p > 0 && r > 0 && n > 0) {
            let emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            let totalAmount = emi * n;
            let totalInterest = totalAmount - p;

            displayEmi.textContent = formatCurrency(Math.round(emi));
            displayInterest.textContent = formatCurrency(Math.round(totalInterest));
        } else {
            displayEmi.textContent = "₹ 0";
            displayInterest.textContent = "₹ 0";
        }
    };

    // Sync Range and Number Inputs
    const syncInputs = (range, input) => {
        range.addEventListener('input', () => {
            input.value = range.value;
            calculateEMI();
        });
        input.addEventListener('input', () => {
            range.value = input.value;
            calculateEMI();
        });
    };

    syncInputs(amtRange, amtInput);
    syncInputs(rateRange, rateInput);
    syncInputs(tenureRange, tenureInput);

    // Initial calculation
    calculateEMI();

    // --- 8. Form Validation & Mock Submit ---
    const applyForm = document.getElementById('loan-form');
    const formMsg = document.getElementById('form-message');

    if(applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = applyForm.querySelector('button');
            const originalText = btn.textContent;
            
            btn.textContent = "Submitting...";
            btn.disabled = true;

            // Mock API delay
            setTimeout(() => {
                formMsg.textContent = "Application Submitted Successfully! Our team will contact you soon.";
                formMsg.style.color = "#25D366"; // Success green
                applyForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
                
                setTimeout(() => { formMsg.textContent = ""; }, 5000);
            }, 1500);
        });
    }
});

// --- 9. Eligibility Checker Logic (Global Function for onclick) ---
function calculateEligibility() {
    const income = parseFloat(document.getElementById('elig-income').value);
    const existingEmi = parseFloat(document.getElementById('elig-emi').value) || 0;
    const rate = parseFloat(document.getElementById('elig-rate').value);
    const tenure = parseFloat(document.getElementById('elig-tenure').value);
    const resultDiv = document.getElementById('elig-result');
    const maxLoanDisplay = document.getElementById('elig-max-loan');

    if (!income || income <= 0 || !rate || !tenure) {
        alert("Please enter valid income, rate, and tenure values.");
        return;
    }

    // Standard Bank Logic: Max EMI capacity is usually 50%-60% of net income
    const maxEmiCapacity = (income * 0.5) - existingEmi;

    if (maxEmiCapacity <= 0) {
        resultDiv.style.display = 'block';
        maxLoanDisplay.textContent = "Not Eligible";
        maxLoanDisplay.style.color = "red";
        return;
    }

    // Reverse EMI formula to find Principal (Loan Amount)
    // P = (EMI * ( (1+r)^n - 1 )) / ( r * (1+r)^n )
    const r = (rate / 12) / 100;
    const n = tenure * 12;
    const mathPow = Math.pow(1 + r, n);
    
    let maxLoan = (maxEmiCapacity * (mathPow - 1)) / (r * mathPow);

    resultDiv.style.display = 'block';
    maxLoanDisplay.style.color = "var(--primary)";
    maxLoanDisplay.textContent = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(Math.round(maxLoan));
}
