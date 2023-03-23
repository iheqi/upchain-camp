// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Score {
  mapping(address => uint) public scores;

  address immutable public teacher;
  constructor(address _teacher) {
    teacher = _teacher;
  }

  modifier onlyTeacher() {
    require(msg.sender == teacher, 'only teacher');
    _;
  }
  function setStudentScore(address student, uint score) external onlyTeacher {
    require(score <= 100, 'score between 0 to 100');
    scores[student] = score;
  }


  // function getTeacher() public view returns (address) {
  //   return teacher;
  // }
}
