class Observable {
  constructor(private subscribeUser: Function) {
  }
  subscribe(...myArguments) {
    let nextFn: Function;
    let errorFn: Function;
    let completeFn: Function;
    let data: any = {};
    let completed:boolean = false;

    if (myArguments.length == 1 && typeof myArguments[0] == 'object') {
      data = myArguments[0];
    }
    else {
      [data.next, data.error, data.complete] = myArguments;
    }

    data.next ? nextFn = data.next:'';
    data.error ? errorFn = data.error:'';
    data.complete ? completeFn = data.complete: '';

    const subscriber = {
      next: (data) => {
        !completed && nextFn(data);
      },
      error: (error) => {
        !completed && errorFn(error);
      },
      complete: () => {
        completed = true;        
        completeFn();
      }
    };

    this.subscribeUser(subscriber);
    return subscriber;
  }

}
