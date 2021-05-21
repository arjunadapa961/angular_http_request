import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  error = new Subject<string>()

  constructor(private http: HttpClient) { }

  onCreatePost(title: string, content: string) {
    let postData: Post = { title: title, content: content }
    this.http.post<{ name: string }>("https://angular-ui-project-default-rtdb.firebaseio.com/posts.json", postData).
      subscribe((responseData) => {
        console.log(responseData)
      },
        error => {
          this.error.next(error.message)
        })
  }

  onFetchPost() {
    let searchParams = new HttpParams()
    searchParams = searchParams.append('print', 'pretty')
    searchParams = searchParams.append('custom', 'key')
    return this.http.get<{ [key: string]: Post }>("https://angular-ui-project-default-rtdb.firebaseio.com/posts.json",
      {
        headers: new HttpHeaders({ "Custom-Header": "hello" }),
        params: searchParams
      })
      .pipe(map(
        responseData => {
          const resultArray: Post[] = []
          for (let key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              resultArray.push({ ...responseData[key], id: key })
            }
          }
          return resultArray
        }
      ),
        catchError((errorMessage) => {
          return throwError(errorMessage)
        })
      )
  }

  onDeletePost() {
    return this.http.delete("https://angular-ui-project-default-rtdb.firebaseio.com/posts.json")
  }
}
