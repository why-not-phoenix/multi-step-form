emailjs.init("7ub3hI-birwAxux8f");

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const userName = document.getElementById('name');
const email = document.getElementById('email');
const telephone = document.getElementById('tel');
const formInput = document.querySelectorAll('.form-input');
const plans = document.querySelectorAll('input[name="plan"]');
const thumb = document.getElementById('toggle-thumb');
const radios = document.querySelectorAll('input[name="billing"]');
const addonPrices = document.querySelectorAll('.addon__price');
const stepNumberContainer = document.querySelector('.step-list');
const stepItems = document.querySelectorAll('.step-item');
const form = document.getElementById('form');
const plansSummaryBox = document.querySelector('.plans-summary');
const addonsSummaryBox = document.querySelector('.addons-summary');

let currentIndex = 1;

const formData = {
    formOne: {},
    formTwo: {},
    formThree: {},
    addonTotal: 0
};

const sendEmail = () => {
  const templateParams = {
    name: formData.formOne?.name || "User",
    email: formData.formOne?.email,
    plan: formData.formTwo?.planName,
    billing: formData.formTwo?.planType,
    total: document.querySelector('.total')?.textContent || "0"
  };

  return emailjs.send(
    "service_no7w45b",
    "template_64ao9tp",
    templateParams
  );
};

const switchNextBtn = () => {
    if(nextBtn.innerHTML === 'Next Step') {
        nextBtn.innerHTML = 'Confirm';
        nextBtn.classList.remove('bg-(--blue-5)');
        nextBtn.classList.add('bg-(--purple-2)');
        nextBtn.setAttribute('type', 'submit');
    } else {
        nextBtn.innerHTML = 'Next Step';
        nextBtn.classList.add('bg-(--blue-5)');
        nextBtn.classList.remove('bg-(--purple-2)');
        nextBtn.setAttribute('type', 'button');
    }
}

const changeForm = (prevIndex, currIndex) => {
    const previousSection = form.querySelector(`[data-index="${prevIndex}"]`);
    const newSection = form.querySelector(`[data-index="${currIndex}"]`);
    if(currIndex < 5) {
        const previousStep = stepNumberContainer.querySelector(`[data-index="${prevIndex}"]`);
        
        previousStep.classList.remove('step-item--active');
        previousStep.removeAttribute('aria-current');
        previousSection.hidden = true;

        const newStep = stepNumberContainer.querySelector(`[data-index="${currIndex}"]`);
        
        newStep.classList.add('step-item--active');
        newStep.setAttribute('aria-current', 'step');
        newSection.hidden = false;
    } else {
        previousSection.hidden = true;
        newSection.hidden = false;
    }

}

const addErrorMessage = (code, input) => {
    input.classList.add('error-border','border-(--red)', 'hover:border-(--red)');
    const errorMsg = document.createElement('span');
    errorMsg.classList.add('error-message', 'ml-auto', 'font-(family-name:--ff-sans)', 'font-bold', 'text-base', 'text-(--red)');
    errorMsg.innerHTML = code === 'empty' ? 'This field is required' : 'Invalid input';
    const errorContainer = input.parentElement.querySelector('div');
    errorContainer.append(errorMsg);
}

const resetErr = () => {
    const errors = document.querySelectorAll('.error-message');
    const errorBorders = document.querySelectorAll('.error-border');
    errors.forEach(err => {
        err.remove();
    })

    errorBorders.forEach(border => {
        border.classList.remove('error-border', 'border-(--red)', 'hover:border-(--red)');
    })
}

const summarizePlans = () => {
    plansSummaryBox.innerHTML = "";
    const plansDescBox = document.createElement('div');

    const selectedPlanSummary = document.createElement('p');
    selectedPlanSummary.classList.add('font-bold', 'text-(--blue-5)')
    selectedPlanSummary.innerHTML = `${formData.formTwo.planName} (${formData.formTwo.planType})`;

    const changePlan = document.createElement('button');
    changePlan.setAttribute('type', 'button');
    changePlan.classList.add('font-normal', 'text-(--grey)', 'hover:text-(--purple-2)', 'underline', 'cursor-pointer');
    changePlan.innerHTML = `Change`;
    changePlan.addEventListener("click", () => {
        changeForm(currentIndex, 2);
        switchNextBtn();
        currentIndex = 2;
    })

    plansDescBox.append(selectedPlanSummary, changePlan);

    const planPrice = document.createElement('span');
    planPrice.classList.add('font-bold', 'text-(--blue-5)');
    planPrice.innerHTML = `$${formData.formTwo.planPrice}/${formData.formTwo.planType === 'Monthly' ? 'mo' : 'yr'}`;

    plansSummaryBox.classList.add('flex', 'justify-between', 'items-center');
    plansSummaryBox.append(plansDescBox, planPrice);
}

const summarizeAddons = () => {
    addonsSummaryBox.innerHTML = '';
    formData.addonTotal = 0;
    if(formData.formThree.length > 0) {
        formData.formThree.forEach(addon => {
            const addonSummary = document.createElement('div');
            addonSummary.classList.add('flex', 'justify-between', 'gap-5');
            
            const addonName = document.createElement('p');
            addonName.classList.add('font-normal', 'text-(--grey)');
            addonName.innerHTML = addon.addonName;

            const addonPrice = document.createElement('span');
            addonPrice.classList.add('font-normal', 'text-(--grey)');
            addonPrice.innerHTML = `+$${addon.addonPrice}/${formData.formTwo.planType === 'Monthly' ? 'mo' : 'yr'}`;

            addonSummary.append(addonName, addonPrice);
            addonsSummaryBox.append(addonSummary);

            formData.addonTotal += addon.addonPrice;
        })
    }
}

const showTotal = () => {
    let totalCost = formData.formTwo.planPrice + formData.addonTotal;
    const orderSummaryText = document.querySelector('.order-total p span');
    
    orderSummaryText.textContent = `${formData.formTwo.planType === 'Monthly' ? 'month' : 'year'}`;

    const orderTotal = document.querySelector('.total');
    orderTotal.innerHTML = `+$${totalCost}/${formData.formTwo.planType === 'Monthly' ? 'mo' : 'yr'}`
}

const summarize = () => {
    summarizePlans();
    summarizeAddons();
    showTotal();
}

const isFormOneValid = (input) => {
    resetErr();
    let valid = true;

    if(input === 'all' || input === userName.id) {
        const user = userName.value;
        if(user.length < 1) {
            addErrorMessage('empty', userName);
            valid = false;
        } else if ((user.length < 2) || (/[<>:@"/\\|?*]+/.test(user))) {
            addErrorMessage('invalid', userName);
            valid = false;
        }
        formData.formOne.name = user;
    }
    
    if(input === 'all' || input === email.id) {
        const mail = email.value;
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if(mail.length < 1) {
            addErrorMessage('empty', email);
            valid = false;
        } else if (!isValidEmail.test(mail)) {
            addErrorMessage('invalid', email);
            valid = false;
        }
        formData.formOne.email = mail;
    }

    if(input === 'all' || input === telephone.id) {
        const phone = telephone.value;
        if(phone.length < 1) {
            addErrorMessage('empty', telephone);
            valid = false;
        } else if ((phone.length !== 11) || isNaN(Number(phone))) {
            addErrorMessage('invalid', telephone);
            valid = false;
        }
        formData.formOne.phone = phone;
    }

    if(input === 'all') {
        return valid;
    }
}

const isFormTwoValid = () => {
    resetErr();
    let valid = false;
    const selected = document.querySelector('input[name="plan"]:checked');
    if(selected) {
        valid = true;
        const checkedBill = document.querySelector('input[name="billing"]:checked');
        formData.formTwo = {
            planName: selected.parentElement.querySelector('.plan-card__title').innerHTML,
            planPrice: Number(selected.parentElement.querySelector('.price').innerHTML),
            planType: checkedBill.nextElementSibling.innerHTML,
        };
    } else {
        const container = document.querySelector('.step-2-content');
        const errorMsg = document.createElement('p');
        errorMsg.classList.add('error-message', 'ml-auto', 'font-(family-name:--ff-sans)', 'font-bold', 'text-base', 'text-(--red)');
        errorMsg.innerHTML = 'No input selected';
        container.prepend(errorMsg);
    }

    return valid;
}

const isFormValid = (tab) => {
    if(tab === 1) {
        return isFormOneValid('all');
    } else if(tab === 2) {
        return isFormTwoValid();
    } else if(tab === 3) {
        const addonsSelected = document.querySelectorAll('input[type="checkbox"]:checked');
        if(addonsSelected) {
            formData.formThree = [];
            addonsSelected.forEach(addon => {
                const addonContainer = addon.parentElement;
                const name = addonContainer.querySelector('.addon__title').innerHTML;
                const price = Number(addonContainer.querySelector('.addon__price span').innerHTML);
                formData.formThree.push({
                    addonName: name, 
                    addonPrice: price
                })
            })
        }
        
        switchNextBtn();
        summarize();
        return true;
    } else {
        return true;
    }
}

const stepForward = () => {
  if (!isFormValid(currentIndex)) return false;

  if (currentIndex === 1) {
    prevBtn.hidden = false;
  }

  changeForm(currentIndex, currentIndex + 1);
  currentIndex++;

  if (currentIndex === 5) {
    sendEmail()
        .then(() => {
        console.log("Email sent ✅");
        })
        .catch((err) => {
        console.error("Email failed ❌", err);
        });
    document.querySelector('.form-navigation').hidden = true;
    stepItems.forEach(item => {
        item.disabled = true;
    })
  }

  return true;
}

const stepBackward = () => {
    if(currentIndex === 2) {
        prevBtn.hidden = true;
    } else if(currentIndex === 4) {
        switchNextBtn();
    }
    changeForm(currentIndex, currentIndex - 1);
    currentIndex--;
}

formInput.forEach(input => {
    input.addEventListener("change", () => {
        isFormOneValid(input.id);
    })
})

plans.forEach(plan => {
    plan.addEventListener("change", () => {
        isFormTwoValid();
    })
})

radios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.value === 'yearly') {
      thumb.style.transform = 'translateX(100%)';
      plans.forEach(plan => {
        const priceContainer = plan.parentElement.querySelector('.plan-card__price');
        let price = priceContainer.querySelector('.price').innerHTML;
        price = Number(price) * 10;
        priceContainer.innerHTML = `$<span class="price">${price}</span>/yr`
        const discountMsg = document.createElement('p');
        discountMsg.classList.add('discountMsg', 'text-(--blue-5)');
        discountMsg.innerHTML = '2 months free';
        priceContainer.parentElement.append(discountMsg);
      })
      addonPrices.forEach(addonPrice => {
        let price = addonPrice.querySelector('span').innerHTML;
        price = Number(price) * 10;
        addonPrice.innerHTML = `+$<span>${price}</span>/yr`;
      })
    } else {
      thumb.style.transform = 'translateX(0)';
      plans.forEach(plan => {
        const priceContainer = plan.parentElement.querySelector('.plan-card__price');
        const price = priceContainer.querySelector('.price');
        const newPrice = Number(price.innerHTML) / 10;
        priceContainer.innerHTML = `$<span class="price">${newPrice}</span>/mo`;
        const discountMsg = priceContainer.parentElement.querySelector('.discountMsg');
        if(discountMsg) discountMsg.remove();
      })
      addonPrices.forEach(addonPrice => {
        let price = addonPrice.querySelector('span').innerHTML;
        price = Number(price) / 10;
        addonPrice.innerHTML = `+$<span>${price}</span>/mo`;
      })
    }
  });
});

// click next
nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    stepForward();
})

// click prev
prevBtn.addEventListener("click", stepBackward);

// Step click control
stepItems.forEach(item => {
    item.addEventListener("click", () => {
        const newIndex = Number(item.getAttribute('data-index'));
        if(newIndex > currentIndex) {
            while (currentIndex < newIndex) {
                if (!stepForward()) break;
            }
        } else {
            while (currentIndex > newIndex) {
                stepBackward();
            }
        }
    })
})