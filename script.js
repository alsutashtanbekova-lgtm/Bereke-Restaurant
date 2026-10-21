const form = document.getElementById("bookingForm");
const dateInput = document.getElementById("date");
const message = document.getElementById("message");
const copyButton = document.getElementById("copyBooking");

// Телефондогу менюну ачуу жана жабуу
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Менюну жабуу" : "Менюну ачуу"
    );
});

// Менюдагы шилтемени басканда керектүү бөлүмгө өтөт
// жана телефон менюсу жабылат
mainNav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function () {
        mainNav.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Менюну ачуу");
    });
});

// Бүгүнкү күндү аныктоо
function todayDate() {
    const now = new Date();

    return new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];
}

// Өткөн күндөрдү тандоого жол бербөө
dateInput.min = todayDate();

// Брондоо билдирүүсүн даярдоо
let bookingText = "";

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const selection = document.getElementById("house").value;
    const date = dateInput.value;
    const details = document.getElementById("details").value.trim();

    if (!name || !phone || !selection || !date) {
        message.textContent =
            "Бардык милдеттүү талааларды толтуруңуз.";
        return;
    }

    if (date < todayDate()) {
        message.textContent = "Өткөн күндү тандай албайсыз.";
        return;
    }

    bookingText =
        "Саламатсызбы! Кафеге брондоо өтүнүчү:\n\n" +
        "Аты: " + name + "\n" +
        "Телефон: " + phone + "\n" +
        "Тандоо: " + selection + "\n" +
        "Келүү күнү: " + date + "\n" +
        "Кошумча маалымат: " + (details || "Жок");

    message.textContent =
        "✅ Брондоо билдирүүсү даярдалды. " +
        "Аны көчүрүп, кафеге жөнөтсөңүз болот.";

    copyButton.hidden = false;
});

// Билдирүүнү көчүрүү
copyButton.addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(bookingText);

        message.textContent =
            "✅ Билдирүү көчүрүлдү! " +
            "Эми аны кафе кызматкерине жөнөтсөңүз болот.";
    } catch (error) {
        message.textContent =
            "Көчүрүү иштеген жок. Билдирүүнү кол менен көчүрүп алыңыз.";
    }
});

// Менюдагы «Тандоо» баскычы тандалган тамакты
// брондоо формасына өткөрөт
document.querySelectorAll(".card-btn").forEach(button => {
    button.addEventListener("click", function () {
        const card = button.closest(".house-card");
        const itemName = card.querySelector("h3").textContent.trim();
        const select = document.getElementById("house");

        const matchingOption = Array.from(select.options).find(option =>
            option.value === itemName ||
            option.textContent.trim() === itemName
        );

        if (matchingOption) {
            select.value = matchingOption.value;
        }
    });
});