const Graphs = artifacts.require('Graphs');

contract("Graphs", (accounts) => {
    before(async() => {
        instance = await Graphs.deployed();
    })

    it('Ensures it is possible to add information to a day', async() => {
        await instance.addToDay(1654387200, "testy,test", 1, 0);
        await instance.addToDay(1654473600, "new,test", 1, 0);
    })

    it("Retrieves information for a period of time", async() => {
        await instance.getDays(1654387200, 1654473600).then((res) => { console.log(res); });
    })
})