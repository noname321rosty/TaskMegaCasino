// Task Mega Casino
//
// Існує 3 сутності User, ігровий автомат (GameMachine) і Casino.
//     Є 2 типи користувачів: User i SuperAdmin (мають розширений набір функцій).
//
// SuperAdmin - користувач, що може керувати казино і має мати можливість:
// - створювати нове Казино;
// - створювати ігрові автомати (GameMachine) у власному Casino (в цьому випадку новий автомат має
// отримати стартову суму з грошей власника казино);
// - метод, щоб забрати з Casino гроші. Вхідний аргумент - сума (number). Вхідний аргумент - сума (number).
//     Функція має зібрати потрібну суму з автоматів (послідовність від автомата, у якому грошей найбільше, до
// автомата у якому грошей найменше) і повернути її;
// - додавати гроші у Casino/GameMachine;
// - видалити ігровий автомат за номером (гроші з видаленого автомату розподіляються порівно між рештою
// автоматів в даному казино);
// - також має мати всі властивості простого User;
// - конструктор приймає 2 вхідні параметри (name, money) - ім'я і початкова сума грошей.
//
// User - простий відвідувач казино (може тільки витрачати/вигравати гроші в автоматах):
// - конструктор приймає 2 вхідні параметри (name, money) -- ім'я і початкова сума грошей;
// - має мати публічні поля: name, money (money ніколи не може бути менше ніж 0);
// - має мати методи:
//     play(money) -- почати гру за якимось GameMachine
//
// Casino:
//     - Конструктор класу Casino приймає один параметр (name) - назва казино
// - геттер getMoney - отримати загальну суму грошей у Casino;
// - геттер getMachineCount - отримати кількість автоматів у Casino.
//     GameMachine
// - Конструктор класу приймає один вхідний параметр: початкову суму грошей яка заноситься в автомат
// (number);
// - геттер getMoney - отримати загальну суму грошей у GameMachine;
// - метод, щоб забрати з GameMachine гроші. Вхідний аргумент - сума (number);
// - Покласти гроші. Вхідний аргумент - сума (number);
// - Зіграти. Вхідний аргумент - сума (number) грошей, яку гравець закидує в автомат.
//     Гроші зараховуються у суму автомату.
//     Метод генерує випадкове 3-х значне число (наприклад 124).
// Якщо у числі 2 цифри однакові, повертається сума у 2 рази більша ніж прийшла в аргументі (і віднімається
// від суми грошей в автоматі).
// Якщо 3 цифри однакові - повертається 3-кратна сума.
//     Необхідно запобігти нелогічній поведінці (видалення неіснуючого автомату, кількість грошей в автоматі чи в
// казино або user менше нуля).
// Завдання повинно бути виконане мовою JavaScript (стандарт ES6).



class GameMachine {
    constructor(bank) {
        this.bank = bank;
    }

    get money() {
        return this.bank;
    }

    takeMoney(money) {
        if (money <= this.bank) {
            this.bank -= money;
        }
    }

    addMoney(money) {
        this.bank += money;
    }

    play(bet) {
        let firstNum = Math.floor(Math.random() * (10));
        let secondNum = Math.floor(Math.random() * (10));
        let thirdNum = Math.floor(Math.random() * (10));
        this.bank += bet;

        console.log(firstNum, secondNum, thirdNum);

        if (
            firstNum === secondNum ||
            firstNum === thirdNum ||
            secondNum === thirdNum
        ) {
            console.log("Ти виграв х2!");
            bet *= 2;
            this.bank -= bet;
            return bet;
        } else if (firstNum === secondNum && secondNum === thirdNum) {
            console.log("Ти виграв х3!");
            bet *= 3;
            this.bank -= bet;
            return bet;
        } else {
            console.log("Ти програв!");
            this.bank += bet;
            return -bet;
        }
    }
}

class Casino {
    constructor(name) {
        this.name = name;
        this.machines = [];
    }

    get getMachineCount() {
        return this.machines.length;
    }

    get getMoney() {
        return this.machines.reduce((acc, machine) => {
            return acc + machine.bank;
        }, 0);
    }
}

class User {
    constructor(name, money) {
        this.name = name;
        this.money = money;
        this._selectMachine = null;
    }

    get selectMachine() {
        return this._selectMachine;
    }

    set selectMachine(machine) {
        this._selectMachine = machine;
    }

    play(bet) {
        if (bet > this.money) {
            console.error(`${this.name} замало грошей`);

            return;
        }

        if (this._selectMachine === null) {
            console.error("Вибери машину для гри");

            return;
        }

        this.money += this._selectMachine.play(bet);
    }
}

class SuperAdmin extends User {
    constructor(name, money) {
        super(name, money);
        this.casino = null;
    }

    createCasino(casinoName) {
        const newCasino = new Casino(casinoName);
        this.casino = newCasino;

        return newCasino;
    }

    createGameMachine(bank) {
        if (!this.casino) {
            console.error("Створи казіно");

            return;
        }

        if (bank >= this.money) {
            console.error("Замало грошей для створення казіно");

            return;
        }

        const newMachine = new GameMachine(bank);
        this.casino.machines.push(newMachine);
        this.money -= bank;

        return newMachine;
    }

    removeGameMachine(id) {
        if (!this.casino) {
            console.error("Створи казіно");

            return;
        }

        const machines = [...this.casino.machines];
        if (!machines.length) {
            console.error("Створи машини");

            return;
        }

        if (machines[id] === undefined) {
            console.error("Неправильне ід машини");

            return;
        }

        const cash = machines[id].bank;
        machines.splice(id, 1);
        const machineCount = machines.length;

        machines.forEach(machine => {
            const profit = (cash / machineCount).toFixed(2);
            machine.bank += +profit;
        });

        this.casino.machines = [...machines];
    }

    takeMoneyFromCasino(sum) {
        const machines = [...this.casino.machines];
        const allBank = machines.reduce((acc, machine) => acc + machine.bank, 0);

        if (sum > allBank) {
            console.error("Сума більша ніж банк казино");

            return;
        }

        const percentageFromBank = sum / allBank;

        machines.forEach(machine => {
            machine.bank = +(machine.bank * (1 - percentageFromBank)).toFixed(2);
        });

        this.casino.machines = [...machines];
        this.money += sum;
    }

    addMoneyToCasino(money) {
        if (money <= 0) {
            console.error("Сума меньша ніж 0");

            return;
        }

        if (!this.casino) {
            console.error("Створи казіно");

            return;
        }

        const length = this.casino.machines.length;
        if (!length) {
            console.error("Створи машину");

            return;
        }

        if (money >= this.money) {
            console.error("Мало грошей щоб додати до машини");

            return;
        }

        this.casino.machines.forEach(machine => {
            machine.bank += money / length;
        });

        this.money -= money;
    }

    addMoneyToGameMachine(id, money) {
        if (money <= 0) {
            console.error("Сума меньша ніж 0");

            return;
        }

        if (!this.casino) {
            console.error("Створи казіно");

            return;
        }

        if (money >= this.money) {
            console.error("Мало грошей щоб додати до машини");

            return;
        }

        if (this.casino.machines[id] === undefined) {
            console.error("Неправильне Ід машини");

            return;
        }

        this.money -= money;
        this.casino.machines[id].bank += money;
    }
}

const admin = new SuperAdmin("admin", 10000);
const casino = admin.createCasino("Casino");
const machine = admin.createGameMachine(1000);
admin.createGameMachine(500);
admin.createGameMachine(500);
admin.takeMoneyFromCasino(1000);
admin.selectMachine = machine;
admin.play(40);
console.log(admin);
const machine1 = new GameMachine(1000);
console.log(`гроші машини ${machine1}` + machine1.money);
machine1.takeMoney(100);
console.log(`гроші машини ${machine1}` + machine1.money);
machine1.addMoney(100);
console.log(`гроші машини ${machine1}` + machine1.money);
machine1.play(100);
console.log(`гроші машини ${machine1}` + machine1.money);
console.log(casino.getMachineCount);
console.log(casino.getMoney);
const machine2 = new GameMachine(1000);
console.log(`гроші машини ${machine2}` + machine2.money);
machine1.takeMoney(100);
console.log(`гроші машини ${machine2}` + machine2.money);
machine1.addMoney(100);
console.log(`гроші машини ${machine2}` + machine2.money);
machine1.play(100);
console.log(`гроші машини ${machine2}` + machine2.money);
console.log(casino.getMachineCount);
console.log(casino.getMoney);
const user1 = new User("Oleg Miami", 500);
user1.selectMachine = machine1;
console.log(user1);
user1.play(`ставка ${user1}` + 10);
user1.play(`ставка ${user1}` + 10);
user1.play(`ставка ${user1}` + 10);
user1.play(`ставка ${user1}` + 10);
console.log(user1);
const user2 = new User("Tom Cruise", 1000);
user2.selectMachine = machine2;
console.log(user2);
user2.play(`ставка ${user2}` + 10);
user2.play(`ставка ${user2}` + 10);
user2.play(`ставка ${user2}` + 10);
user2.play(`ставка ${user2}` + 10);
console.log(user2);
admin.removeGameMachine(1);
console.log(casino);
admin.takeMoneyFromCasino(100);
console.log(casino);
admin.addMoneyToCasino(100);
console.log(casino);
admin.addMoneyToGameMachine(0, 100);
