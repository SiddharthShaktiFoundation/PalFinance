/* =========================================================
   PALFIN
   Vanilla JavaScript
   ========================================================= */

"use strict";


/* =========================================================
   HEADER — STICKY EFFECT
   ========================================================= */

const siteHeader = document.getElementById("siteHeader");

function updateHeader() {
    if (window.scrollY > 20) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================================
   MOBILE NAVIGATION
   ========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

if (menuToggle && mobileNav) {

    menuToggle.addEventListener("click", () => {

        const isOpen =
            mobileNav.classList.toggle("open");

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

        menuToggle.setAttribute(
            "aria-label",
            isOpen
                ? "Close navigation menu"
                : "Open navigation menu"
        );

    });


    mobileNav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            mobileNav.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

        });

    });

}


/* =========================================================
   FAQ ACCORDION
   ========================================================= */

const faqQuestions =
    document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {

    question.addEventListener("click", () => {

        const currentItem =
            question.closest(".faq-item");

        const isCurrentlyOpen =
            currentItem.classList.contains("open");


        /*
         * Close all other FAQ items.
         */

        document
            .querySelectorAll(".faq-item")
            .forEach(item => {

                item.classList.remove("open");

                const btn =
                    item.querySelector(".faq-question");

                if (btn) {
                    btn.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }

            });


        /*
         * Open selected item if it wasn't already open.
         */

        if (!isCurrentlyOpen) {

            currentItem.classList.add("open");

            question.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});


/* =========================================================
   LOAN CALCULATOR
   ========================================================= */

const loanAmount =
    document.getElementById("loanAmount");

const loanTenure =
    document.getElementById("loanTenure");

const interestRate =
    document.getElementById("interestRate");

const loanAmountOutput =
    document.getElementById("loanAmountOutput");

const loanTenureOutput =
    document.getElementById("loanTenureOutput");

const interestRateOutput =
    document.getElementById("interestRateOutput");

const emiResult =
    document.getElementById("emiResult");

const interestResult =
    document.getElementById("interestResult");

const repaymentResult =
    document.getElementById("repaymentResult");


function formatCurrency(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }
    ).format(value);

}


function calculateLoan() {

    if (
        !loanAmount ||
        !loanTenure ||
        !interestRate
    ) {
        return;
    }


    const principal =
        Number(loanAmount.value);

    const months =
        Number(loanTenure.value);

    const annualRate =
        Number(interestRate.value);


    const monthlyRate =
        annualRate / 100 / 12;


    let emi;


    /*
     * Standard reducing-balance EMI formula:
     *
     * EMI =
     * P × r × (1+r)^n
     * -----------------
     *     (1+r)^n - 1
     */

    if (monthlyRate === 0) {

        emi =
            principal / months;

    } else {

        const factor =
            Math.pow(
                1 + monthlyRate,
                months
            );

        emi =
            principal *
            monthlyRate *
            factor /
            (factor - 1);

    }


    const totalRepayment =
        emi * months;

    const totalInterest =
        totalRepayment - principal;


    loanAmountOutput.textContent =
        formatCurrency(principal);

    loanTenureOutput.textContent =
        `${months} ${months === 1 ? "month" : "months"}`;

    interestRateOutput.textContent =
        `${annualRate}%`;


    emiResult.textContent =
        formatCurrency(emi);

    interestResult.textContent =
        formatCurrency(totalInterest);

    repaymentResult.textContent =
        formatCurrency(totalRepayment);

}


[
    loanAmount,
    loanTenure,
    interestRate
].forEach(input => {

    if (input) {

        input.addEventListener(
            "input",
            calculateLoan
        );

    }

});


calculateLoan();


/* =========================================================
   MOBILE NUMBER VALIDATION
   ========================================================= */

function cleanMobileNumber(value) {

    return value
        .replace(/\D/g, "")
        .slice(0, 10);

}


function isValidIndianMobile(value) {

    return /^[6-9]\d{9}$/.test(value);

}


/* =========================================================
   APPLY NOW — MOBILE → OTP PLACEHOLDER
   ========================================================= */

const mobileForm =
    document.getElementById("mobileForm");

const mobileNumber =
    document.getElementById("mobileNumber");

const mobileError =
    document.getElementById("mobileError");

const mobileStep =
    document.getElementById("mobileStep");

const otpStep =
    document.getElementById("otpStep");

const backToMobile =
    document.getElementById("backToMobile");


if (mobileNumber) {

    mobileNumber.addEventListener(
        "input",
        () => {

            mobileNumber.value =
                cleanMobileNumber(
                    mobileNumber.value
                );

            mobileError.textContent = "";

        }
    );

}


if (mobileForm) {

    mobileForm.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const mobile =
                cleanMobileNumber(
                    mobileNumber.value
                );


            if (!isValidIndianMobile(mobile)) {

                mobileError.textContent =
                    "Please enter a valid 10-digit mobile number.";

                mobileNumber.focus();

                return;

            }


            mobileError.textContent = "";


            /*
             * ==================================================
             * BACKEND / OTP INTEGRATION POINT
             * ==================================================
             *
             * DO NOT implement fake OTP verification here.
             *
             * In production, connect to your backend:
             *
             * POST /api/auth/send-otp
             *
             * Example:
             *
             * const response = await fetch(
             *     "/api/auth/send-otp",
             *     {
             *         method: "POST",
             *         headers: {
             *             "Content-Type": "application/json"
             *         },
             *         body: JSON.stringify({
             *             mobile: mobile
             *         })
             *     }
             * );
             *
             * Then display the real OTP verification interface.
             *
             * Firebase Authentication or another approved
             * authentication provider can also be integrated.
             *
             * NEVER place private API keys, database credentials,
             * JWT signing secrets, lender credentials or other
             * sensitive secrets inside this frontend.
             * ==================================================
             */


            /*
             * Frontend-only placeholder:
             * move user to the OTP screen.
             */

            mobileStep.classList.remove("active");

            otpStep.classList.add("active");


            showToast(
                "Application started. Real OTP verification requires backend integration."
            );

        }
    );

}


if (backToMobile) {

    backToMobile.addEventListener(
        "click",
        () => {

            otpStep.classList.remove("active");

            mobileStep.classList.add("active");

            mobileNumber.focus();

        }
    );

}


/* =========================================================
   CONTACT FORM
   ========================================================= */

const contactForm =
    document.getElementById("contactForm");

const contactName =
    document.getElementById("contactName");

const contactEmail =
    document.getElementById("contactEmail");

const contactMobile =
    document.getElementById("contactMobile");

const contactMessage =
    document.getElementById("contactMessage");

const contactMessageStatus =
    document.getElementById(
        "contactMessageStatus"
    );


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
    );

}


if (contactMobile) {

    contactMobile.addEventListener(
        "input",
        () => {

            contactMobile.value =
                cleanMobileNumber(
                    contactMobile.value
                );

        }
    );

}


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                contactName.value.trim();

            const email =
                contactEmail.value.trim();

            const message =
                contactMessage.value.trim();


            if (!name) {

                showFormMessage(
                    "Please enter your name.",
                    true
                );

                contactName.focus();

                return;

            }


            if (!isValidEmail(email)) {

                showFormMessage(
                    "Please enter a valid email address.",
                    true
                );

                contactEmail.focus();

                return;

            }


            if (
                contactMobile.value &&
                !isValidIndianMobile(
                    contactMobile.value
                )
            ) {

                showFormMessage(
                    "Please enter a valid mobile number.",
                    true
                );

                contactMobile.focus();

                return;

            }


            if (message.length < 5) {

                showFormMessage(
                    "Please enter a message.",
                    true
                );

                contactMessage.focus();

                return;

            }


            /*
             * ==================================================
             * BACKEND INTEGRATION POINT
             * ==================================================
             *
             * Replace this frontend-only handling with:
             *
             * POST /api/contact
             *
             * Example:
             *
             * fetch("/api/contact", {
             *     method: "POST",
             *     headers: {
             *         "Content-Type": "application/json"
             *     },
             *     body: JSON.stringify({
             *         name,
             *         email,
             *         mobile: contactMobile.value,
             *         message
             *     })
             * });
             *
             * The backend should perform authentication,
             * rate limiting, validation, spam protection and
             * secure storage/transmission as appropriate.
             * ==================================================
             */


            showFormMessage(
                "Your message is ready to be submitted once the contact backend is connected.",
                false
            );


            showToast(
                "Contact form validated successfully."
            );

        }
    );

}


function showFormMessage(
    message,
    isError
) {

    if (!contactMessageStatus) {
        return;
    }

    contactMessageStatus.textContent =
        message;

    contactMessageStatus.style.color =
        isError
            ? "#dc2626"
            : "#059669";

}


/* =========================================================
   TOAST
   ========================================================= */

const toast =
    document.getElementById("toast");

let toastTimer = null;


function showToast(message) {

    if (!toast) {
        return;
    }


    toast.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 4500);

}


/* =========================================================
   SMOOTH INTERNAL NAVIGATION
   ========================================================= */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                const target =
                    document.querySelector(
                        targetId
                    );


                if (!target) {
                    return;
                }


                event.preventDefault();


                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


/* =========================================================
   BASIC BUTTON / KEYBOARD POLISH
   ========================================================= */

document
    .querySelectorAll("button")
    .forEach(button => {

        button.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    /*
                     * Native buttons already support these
                     * interactions. This listener intentionally
                     * does not force-click them, avoiding duplicate
                     * submissions.
                     */

                }

            }
        );

    });
