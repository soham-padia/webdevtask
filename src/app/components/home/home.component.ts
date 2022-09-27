import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {decode} from "html-entities";
const url:string="https://opentdb.com/api.php?amount=10"
export class Card{
  constructor(public category:string,
              public type:string,
              public difficulty:string,
              public question:string,
              public correct_answer:string,
              public incorrect_answers:string[]) {
  }
}

export class Cardpp{
  constructor(public category:string,
              public type:string,
              public difficulty:string,
              public question:string,
              public answers:Answer[]) {
  }
}

export class Answer{
  constructor(public answer:string,
              public correctAnswer:number) {
  }
}

export class ResponseApi{
  constructor(public response_code:number,
              public results:Card[]) {

  }
}

export class QandA{
  constructor(public question:string,
              public options:string[]) {
  }
}

@Injectable({
  providedIn:"root"
})
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  valueFromRadio=0;
  fetchedData: ResponseApi ={
    response_code:1,
    results:[]
  };
  answerValue=0
  questionanswerd=0

  // @ts-ignore
  impData:QandA[]

  count=0
  cards:Cardpp[]=[]
  answer: number[]=[];
  constructor(private http:HttpClient) { }

  getAns(question:string) {
    if (this.answerValue){
      this.count++;
    }
    this.questionanswerd++;
    if (this.questionanswerd==10){
      alert("Your final score is "+this.count)
    }
    let index = this.cards.findIndex(x => x.question === question)
    this.cards[index].question=""
    console.log("skjdasjgb",this.cards[index])
  }

  private async fetchData(){
    this.http.get<any>(url).subscribe(
      res=>{
        this.fetchedData=res
        /*this.fetchedData.results.map((value, index) => {

          this.cards[index]=value/!*
          let question=value.question
          let options=[value.correct_answer,...value.incorrect_answers]
          this.impData[index]={question,options}*!/
          console.log("ok")
        })*/
        let i=0
        for (let question of this.fetchedData.results){
          this.cards[i]={question:"",type:"",category:"",answers:[],difficulty:""}
          this.cards[i].question=question.question
          this.cards[i].type=question.type
          this.cards[i].category=question.category
          this.cards[i].difficulty=question.difficulty
          let answers:Answer[]=[];
          let correctAnswer:Answer={correctAnswer:1,answer:question.correct_answer}
          answers.push(correctAnswer)

          for (let answer of question.incorrect_answers) {
            let wrongAnswer:Answer={answer:answer,correctAnswer:0};
            answers.push(wrongAnswer);
          }
          this.cards[i].answers=this.shuffle(answers)
          i++;
        }
        console.log("1222",this.cards)
        console.log("hjsaduyj",this.impData)
      }
    );

  }

  shuffle(a:Answer[]){
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  ngOnInit(): void {
    this.fetchData()
    console.log(this.cards)
  }



  decode(s: string) {
    return decode(s)
  }
}
