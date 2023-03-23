// SPDX-License-Identifier: MIT
import "./Score.sol";

pragma solidity ^0.8.0;

contract Teacher {
  mapping(address => bool) teachers;
  Score immutable public score;
  address immutable public owner;

  constructor() {
    owner = msg.sender;
    teachers[msg.sender] = true;
    score = new Score(address(this));
  } 

  function setTeacher(bool value) external {
    require(msg.sender == owner, "only owner");
    teachers[msg.sender] = value;
  }

  function setStudentScore(address _student, uint _score) external {
    require(teachers[msg.sender], "only teacher");
    score.setStudentScore(_student, _score);
  }
}
