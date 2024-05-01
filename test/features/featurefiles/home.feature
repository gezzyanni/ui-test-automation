Feature: Chapter 3: Code once, runs forever
    Visit the following website: https://flip.id/. 
    Please create an automation testing for the following scenarios.

    Scenario: Switch the language
        Given User visit "https://flip.id/"
        When User verify toggle to switch language
        Then User switch and verify language to ENGLISH
        And User switch and verify language to INDONESIA