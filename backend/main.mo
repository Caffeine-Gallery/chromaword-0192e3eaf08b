import Bool "mo:base/Bool";
import Char "mo:base/Char";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Int64 "mo:base/Int64";
import List "mo:base/List";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Random "mo:base/Random";
import Buffer "mo:base/Buffer";
import Blob "mo:base/Blob";

actor {
    // List of words that can be used in the game
    private let words : [Text] = ["HELLO", "WORLD", "GAMES", "MOTOKO", "CYCLE"];
    private var currentWord : Text = "";
    
    // Initialize the game with a random word
    public func startGame() : async Text {
        let randomBytes = await Random.blob();
        let bytes = Blob.toArray(randomBytes);
        let randomIndex = Nat.abs(Float.toInt(Float.fromInt64(Int64.fromNat64(Nat64.fromNat(Nat8.toNat(bytes[0])))) * (Float.fromInt(words.size()) / 256.0)));
        currentWord := words[randomIndex];
        return Text.replace(currentWord, #char '.', "*");
    };

    // Check a guess and return feedback
    public query func checkGuess(guess: Text) : async {
        correct: Bool;
        feedback: Text;
    } {
        if (Text.size(guess) != Text.size(currentWord)) {
            return {
                correct = false;
                feedback = "Invalid guess length"
            };
        };

        var feedback = "";
        var allCorrect = true;

        let guessChars = Iter.toArray(Text.toIter(Text.toUppercase(guess)));
        let wordChars = Iter.toArray(Text.toIter(currentWord));
        let length = Nat.min(guessChars.size(), wordChars.size());

        for (i in Iter.range(0, length - 1)) {
            if (guessChars[i] == wordChars[i]) {
                feedback := feedback # "1"; // Correct letter
            } else {
                feedback := feedback # "0"; // Incorrect letter
                allCorrect := false;
            };
        };

        return {
            correct = allCorrect;
            feedback = feedback;
        };
    };

    // Get the current word (for when game is over)
    public query func getCurrentWord() : async Text {
        currentWord
    };
};
