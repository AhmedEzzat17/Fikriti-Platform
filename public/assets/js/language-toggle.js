document.addEventListener("DOMContentLoaded", function () {
    const langToggle = document.getElementById("language-toggle");
    const elementsToTranslate = {
        "Home": { en: "Home", ar: "الرئيسية" },
        "About Us": { en: "About Us", ar: "من نحن" },
        "Our Portfolio": { en: "Our Portfolio", ar: "أعمالنا" },
        "Our Products": { en: "Our Products", ar: "منتجاتنا" },
        "Contact": { en: "Contact", ar: "اتصل بنا" },
        "Fikrati Software Solutions.": { en: "Fikrati Software Solutions.", ar: "فكرتي لحلول البرمجيات." },
        "For website design and development services and phone applications operating on the Android and iOS operating systems, the company provides integrated web solutions to all institutions in the world and has a huge customer base in all countries of the world.": {
            en: "For website design and development services and phone applications operating on the Android and iOS operating systems, the company provides integrated web solutions to all institutions in the world and has a huge customer base in all countries of the world.",
            ar: "لتصميم وتطوير مواقع الويب وتطبيقات الهاتف العاملة على أنظمة التشغيل أندرويد و iOS، توفر الشركة حلول ويب متكاملة لجميع المؤسسات حول العالم ولديها قاعدة عملاء ضخمة في جميع الدول."
        }
    };
    
    let currentLang = "en";
    
    langToggle.addEventListener("click", function (event) {
        event.preventDefault();
        currentLang = currentLang === "en" ? "ar" : "en";
        langToggle.textContent = currentLang === "en" ? "Ar" : "En";
        document.documentElement.setAttribute("lang", currentLang);
        
        document.querySelectorAll(".nav-link, h2, p, h1, h3, a").forEach(element => {
            let text = element.textContent.trim();
            if (elementsToTranslate[text]) {
                element.textContent = elementsToTranslate[text][currentLang];
            }
        });
    });
});