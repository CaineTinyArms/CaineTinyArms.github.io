const filterButtons = document.querySelectorAll(".filter-button");

const projectCards = document.querySelectorAll(".archive-project");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        projectCards.forEach(card => {

            const categories =
                card.dataset.category.split(" ");

            if (
                filter === "all" ||
                categories.includes(filter)
            ) {

                card.classList.remove("hidden");

            }

            else {

                card.classList.add("hidden");

            }

        });

    });

});