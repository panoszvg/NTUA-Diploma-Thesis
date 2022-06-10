// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./Strings.sol";

contract Graphs {
    using Strings for string;

    // state variables
    struct Day {
        string[] keywords;
        uint questions;
        uint answers;
        uint noKeywords; // number of questions that don't have keywords
    }

    // map a uint that represents date to a custom struct
    mapping(uint => Day) daysStorage;

    // add keywords, question, answers, noKeywords
    function addToDay(uint date, string memory newKeywordsString, uint newQuestions, uint newAnswers, uint newNoKeywords) public {
        require(date % 86400 == 0 , "Date given must have a time of 00:00:00.");
        // keywords are given
        if (bytes(newKeywordsString).length != 0) {
            require(newQuestions >= (newNoKeywords + 1), "The number of questions doesn't match the sum of questions with and without keywords.");
            string[] memory newKeywords = newKeywordsString.split(",");
            // add new keywords to day
            for (uint i = 0; i < newKeywords.length; i++) {
                daysStorage[date].keywords.push(newKeywords[i]);
            }
        }
        else {
            require(newQuestions >= newNoKeywords, "The number of questions doesn't match the sum of questions with and without keywords.");
        }
        // update questions/answers/noKeywords number
        daysStorage[date].questions += newQuestions;
        daysStorage[date].answers += newAnswers;
        daysStorage[date].noKeywords += newNoKeywords;
    }

    // get (keywords, questionsPerDay, answersPerDay) for a period of time (dateFrom, DateTo)
    function getDays(uint dateFrom, uint dateTo) public view
    returns (string[] memory keywords, uint[] memory questions, uint[] memory answers, uint[] memory noKeywords) {
        require(dateFrom % 86400 == 0 , "First date given must have a time of 00:00:00");
        require(dateTo % 86400 == 0 , "Second date given must have a time of 00:00:00");
        require(dateFrom <= dateTo , "Second date given must be the same or later than the first date");
        
        uint totalDays = ((dateTo - dateFrom) / 86400) + 1;
        
        // get number of all keywords that will be returned to create fixed size array
        uint keywordsSize = 0;
        for (uint tempDate = dateFrom; tempDate <= dateTo; tempDate += 86400) {
            keywordsSize += daysStorage[tempDate].keywords.length;
        }

        // define accumulators to return
        keywords = new string[](keywordsSize);
        questions = new uint[](totalDays);
        answers = new uint[](totalDays);
        noKeywords = new uint[](totalDays);

        // add (all keywords)/(questions per day)/(answers per day)/(noKeywords per day) to return arrays
        uint keywordsIndex = 0;
        uint dayIndex = 0;
        for (uint tempDate = dateFrom; tempDate <= dateTo; tempDate += 86400) {
            for (uint k = 0; k < daysStorage[tempDate].keywords.length; k++) {
                keywords[keywordsIndex++] = daysStorage[tempDate].keywords[k];
            }
            questions[dayIndex] = daysStorage[tempDate].questions;
            answers[dayIndex] = daysStorage[tempDate].answers;
            noKeywords[dayIndex++] = daysStorage[tempDate].noKeywords;
        }
        return (keywords, questions, answers, noKeywords);
    }
}