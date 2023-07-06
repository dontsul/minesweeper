// Написать реализацию игры ["Сапер"](http://minesweeper.odd.su/). Задача должна быть реализована на языке javascript, без использования фреймворков и сторонник библиотек (типа Jquery).

// #### Технические требования:
// - Нарисовать на экране поле 8*8 (можно использовать таблицу или набор блоков).
// - Сгенерировать на поле случайным образом 10 мин. Пользователь не видит где они находятся.
// - Клик левой кнопкой по ячейке поля "открывает" ее содержимое пользователю.
//   - Если в данной ячейке находится мина, игрок проиграл. В таком случае показать все остальные мины на поле. Другие действия стают недоступны, можно только начать новую игру.
//   - Если мины нет, показать цифру - сколько мин находится рядом с этой ячейкой.
//   - Если ячейка пустая (рядом с ней нет ни одной мины) - необходимо открыть все соседние ячейки с цифрами.
// - Клик правой кнопки мыши устанавливает или снимает с "закрытой" ячейки флажок мины.
// - После первого хода над полем должна появляться кнопка "Начать игру заново",  которая будет обнулять предыдущий результат прохождения и заново инициализировать поле.
// - Над полем должно показываться количество расставленных флажков, и общее количество мин (например `7 / 10`).

// #### Необязательное задание продвинутой сложности:
// - При двойном клике на ячейку с цифрой - если вокруг нее установлено такое же количество флажков, что указано на цифре этой ячейки, открывать все соседние ячейки.
// - Добавить возможность пользователю самостоятельно указывать размер поля. Количество мин на поле можно считать по формуле `Количество мин = количество ячеек / 6`.

function createMinesweeper() {
  const container = document.createElement("div");
  let inputWrap = document.createElement("div");
  let input = document.createElement("input");
  let btn = document.createElement("button");

  let fieldWrap = document.createElement("div");

  const btnNewGame = document.createElement("button");

  let divResult = document.createElement("div");
  let countFlag = document.createElement("p");
  let countBomb = document.createElement("p");

  //функция создания инпута ввода и добавления inputa на страницу---------------------
  function createInputWrapper() {
    input.type = "number";
    input.placeholder = "Укажите размер поля";
    btn.textContent = "Создать поле";
    inputWrap.prepend(input);
    inputWrap.append(btn);
    container.prepend(inputWrap);
  }

  createInputWrapper();

  fieldWrap.classList.add("field-wrap");
  inputWrap.after(fieldWrap);
  //функция создания инпута ввода и добавления inputa на страницу---------------------

  // функция создания результата колличества флажков и бомб-------------

  let countFlagNumber = 0;

  function createResultFlagBomb() {
    divResult.classList.add("block-result");

    countFlag.textContent = `Расставленных флажков: ${countFlagNumber}`;
    countBomb.textContent = `Количество мин: 0`;

    divResult.append(countFlag);
    divResult.append(countBomb);

    inputWrap.after(divResult);
  }
  createResultFlagBomb();

  // функция создания результата колличества флажков и бомб-------------
  let flag = true;
  container.classList.add("container");
  document.querySelector("h1").after(container);
  //document.body.prepend

  //функция создания поля-------------------------------------------
  btn.addEventListener("click", createField, { once: true });
  //let number = 1;
  function createField() {
    let table = document.createElement("table");
    table.classList.add("table");

    for (let i = 0; i < Number(input.value); i++) {
      let tr = document.createElement("tr");
      for (let k = 0; k < Number(input.value); k++) {
        let td = document.createElement("td");
        let contentP = document.createElement("p");

        td.classList.add("square");
        td.classList.add("b-color");
        contentP.classList.add("content");
        contentP.classList.add("content-square-active");

        // td.dataset.number = number;
        // number++;

        td.append(contentP);
        tr.append(td);
      }
      table.append(tr);
    }
    fieldWrap.append(table);

    //функция рамдомной установки мин-------------------------------------

    function setBomb() {
      let squareContent = document.querySelectorAll(".content");
      let indexSquareTd = Number(input.value) * Number(input.value) - 1;

      let amountBomb = indexSquareTd / 6;

      function randomNumber() {
        return Math.floor(0 + Math.random() * (indexSquareTd + 1 - 0));
      }

      for (let i = 0; i < amountBomb; i++) {
        if (squareContent[randomNumber()].textContent !== "💣") {
          squareContent[randomNumber()].textContent = "💣";
        } else {
          amountBomb++;
        }
      }
    }

    setBomb();
    //функция рамдомной установки мин-------------------------------------
    createNumberOnField(); // функция расстановки чисел
    //добавления событий на ячейки--------------------
    let squareTdEvent = document.querySelector(".table");

    //событие на левую клавишу------------------
    squareTdEvent.addEventListener("click", openSquare);
    let count = 1;
    function openSquare(event) {
      let hideContent = document.querySelectorAll(".content-square-active");
      if (count === 1) {
        createBtnNewGame();
        count++;
      }
      if (flag === false) {
        return;
      }

      if (event.target.nodeName === "TABLE" || event.target.nodeName === "TR") {
        return;
      }
      event.target.closest("td").classList.remove("b-color");
      event.target.firstElementChild.classList.remove("content-square-active");

      if (event.target.closest("td").classList.contains("set-flag")) {
        countFlagNumber--;
        countFlag.textContent = `Расставленных флажков: ${countFlagNumber}`;
        event.target.classList.remove("set-flag");
      }

      if (event.target.textContent === "💣") {
        event.currentTarget.classList.add("open-td");
        hideContent.forEach((item) => {
          item.classList.remove("content-square-active");
        });

        flag = false;

        if (flag === false) {
          input.setAttribute("readonly", true);
        }

        setTimeout(() => {
          alert("Вы проиграли");
        }, 300);
      }
      //функция удаления флага в ячейке бомбы------------------------------------
      function deleteBombFlag() {
        let allTd = document.querySelectorAll(".square");
        Array.from(allTd).forEach((item) => {
          if (
            item.firstElementChild.textContent === "💣" &&
            !item.classList.contains("b-color")
          ) {
            item.classList.remove("set-flag");
          }
        });
      }
      deleteBombFlag();
      //функция удаления флага в ячейке бомбы------------------------------------
    }
    //событие на левую клавишу------------------------

    //событие на правую клавишу-------------------------
    squareTdEvent.addEventListener("contextmenu", setFlag);
    function setFlag(event) {
      event.preventDefault();
      event.target.classList.toggle("set-flag");

      if (
        event.target.nodeName === "TD" &&
        event.target.classList.contains("b-color")
      ) {
        if (event.target.classList.contains("set-flag")) {
          countFlagNumber++;
          countFlag.textContent = `Расставленных флажков: ${countFlagNumber}`;
        } else {
          countFlagNumber--;
          countFlag.textContent = `Расставленных флажков: ${countFlagNumber}`;
        }
      }
    }
    //событие на правую клавишу-------------------------

    //добавления событий на ячейки--------------------

    // кнопка начать новую игру--------------------
    function createBtnNewGame() {
      btnNewGame.textContent = "Начать игру заново";
      btnNewGame.classList.add("btn-new-game");

      fieldWrap.before(btnNewGame);

      btnNewGame.addEventListener("click", (event) => {
        container.remove();
        createMinesweeper();
      });
    }
    // кнопка начать новую игру--------------------
  }
  //функция создания поля-----------------------------------------------

  function createNumberOnField() {
    let countRows = 1;
    let squareContentAll = document.querySelectorAll(".content");
    let arrSquareContentAll = Array.from(squareContentAll);

    let arrBombs = arrSquareContentAll.filter((item) => {
      if (item.textContent === "💣") {
        return item;
      }
    });

    arrSquareContentAll.forEach((item) => {
      if (item.textContent !== "💣") {
        item.textContent = 0;
      }
    });

    countBomb.textContent = `Количество мин: ${arrBombs.length}`;

    for (let i = 0; i < arrSquareContentAll.length; i++) {
      if (arrSquareContentAll[i].textContent === "💣") {
        if (i - 1 >= 0) {
          if (arrSquareContentAll[i - 1] !== "💣" && i - 1 >= 0) {
            if (Number(arrSquareContentAll[i - 1].textContent) === 0) {
              arrSquareContentAll[i - 1].textContent =
                Number(arrSquareContentAll[i - 1].textContent) + 1;
            }
          }
        }

        if (i + 1 < Number(input.value) * Number(input.value) - 1) {
          if (
            arrSquareContentAll[i + 1].textContent === "0" ||
            (Number(arrSquareContentAll[i + 1].textContent) / 1 &&
              i + 1 <= arrSquareContentAll.length - 1)
          ) {
            if (arrSquareContentAll[i + 2].textContent === "💣") {
              arrSquareContentAll[i + 1].textContent =
                Number(arrSquareContentAll[i + 1].textContent) + 1;
            } else if (Number(arrSquareContentAll[i + 1].textContent) === 0) {
              arrSquareContentAll[i + 1].textContent =
                Number(arrSquareContentAll[i + 1].textContent) + 1;
            }
          }
        }

        //     //---------------------

        if (i - Number(input.value) >= 0) {
          //console.log(1);
          if (
            arrSquareContentAll[i - Number(input.value)].textContent === "0" ||
            (Number(arrSquareContentAll[i - Number(input.value)].textContent) /
              1 &&
              i - Number(input.value) >= 0)
          ) {
            arrSquareContentAll[i - Number(input.value)].textContent =
              Number(arrSquareContentAll[i - Number(input.value)].textContent) +
              1;
          }
        }

        if (i - Number(input.value) - 1 >= 0) {
          // console.log(1);
          if (
            arrSquareContentAll[i - Number(input.value) - 1].textContent ===
              "0" ||
            (Number(
              arrSquareContentAll[i - Number(input.value) - 1].textContent
            ) / 1 &&
              i - Number(input.value) >= 0)
          ) {
            arrSquareContentAll[i - Number(input.value) - 1].textContent =
              Number(
                arrSquareContentAll[i - Number(input.value) - 1].textContent
              ) + 1;
          }
        }

        if (i - Number(input.value) + 1 >= 0) {
          //console.log(1);
          if (
            arrSquareContentAll[i - Number(input.value) + 1].textContent ===
              "0" ||
            (Number(
              arrSquareContentAll[i - Number(input.value) + 1].textContent
            ) / 1 &&
              i - Number(input.value) >= 0)
          ) {
            arrSquareContentAll[i - Number(input.value) + 1].textContent =
              Number(
                arrSquareContentAll[i - Number(input.value) + 1].textContent
              ) + 1;
          }
        }

        //-----------------------------------------------------------------------------
        if (
          i + Number(input.value) <
          Number(input.value) * Number(input.value) - 1
        ) {
          // console.log(1);
          if (
            arrSquareContentAll[i + Number(input.value)].textContent === "0" ||
            (Number(arrSquareContentAll[i + Number(input.value)].textContent) /
              1 &&
              i + Number(input.value) <= arrSquareContentAll.length)
          ) {
            arrSquareContentAll[i + Number(input.value)].textContent =
              Number(arrSquareContentAll[i + Number(input.value)].textContent) +
              1;
          }
        }

        if (
          i + Number(input.value) - 1 <
          Number(input.value) * Number(input.value) - 1 - 1
        ) {
          //console.log(1);
          if (
            arrSquareContentAll[i + Number(input.value) - 1].textContent ===
              "0" ||
            (Number(
              arrSquareContentAll[i + Number(input.value) - 1].textContent
            ) / 1 &&
              i + Number(input.value) <= arrSquareContentAll.length)
          ) {
            arrSquareContentAll[i + Number(input.value) - 1].textContent =
              Number(
                arrSquareContentAll[i + Number(input.value) - 1].textContent
              ) + 1;
          }
        }

        if (
          i + Number(input.value) + 1 <
          Number(input.value) * Number(input.value)
        ) {
          //console.log(1);
          if (
            arrSquareContentAll[i + Number(input.value) + 1].textContent ===
              "0" ||
            (Number(
              arrSquareContentAll[i + Number(input.value) + 1].textContent
            ) / 1 &&
              i + Number(input.value) <= arrSquareContentAll.length)
          ) {
            arrSquareContentAll[i + Number(input.value) + 1].textContent =
              Number(
                arrSquareContentAll[i + Number(input.value) + 1].textContent
              ) + 1;
          }
        }
      }
    }
    //----------------------------------------

    for (
      let k = 1;
      k <= Number(input.value) * Number(input.value) - 1;
      k = k + Number(input.value)
    ) {
      if (k === 1) continue;

      if (arrSquareContentAll[k - 1].textContent === "💣" && k - 1 !== 0) {
        arrSquareContentAll[k - 2].textContent =
          Number(arrSquareContentAll[k - 2].textContent) - 1;
      }

      if (arrSquareContentAll[k - 2].textContent === "💣") {
        arrSquareContentAll[k - 1].textContent =
          Number(arrSquareContentAll[k - 1].textContent) - 1;
      }
    }
  }
}
createMinesweeper();


