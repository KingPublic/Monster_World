export interface SprintBudget {capacity:number;drain:number;recovery:number;recoveryDelay:number;restartFraction:number;}
/** Transient energy belongs to each controller, never a mount session or save. */
export class SprintStamina {
  private amount:number;
  private delay=0;
  private releaseNeeded=false;
  exhausted=false;
  constructor(private readonly budget:SprintBudget){this.amount=budget.capacity;}
  get ratio():number{return this.amount/this.budget.capacity;}
  allows(held:boolean):boolean{
    if(!held)this.releaseNeeded=false;
    if(this.exhausted&&!this.releaseNeeded&&this.ratio>=this.budget.restartFraction)this.exhausted=false;
    return held&&!this.exhausted&&this.amount>0;
  }
  update(dt:number,used:boolean):void{
    if(dt<=0||!Number.isFinite(dt))return;
    const delta=Math.min(.1,dt);
    if(used){
      this.amount=Math.max(0,this.amount-this.budget.drain*delta);this.delay=this.budget.recoveryDelay;
      if(this.amount<=.00001){this.amount=0;this.exhausted=true;this.releaseNeeded=true;}
    }else{
      const recovering=Math.max(0,delta-this.delay);this.delay=Math.max(0,this.delay-delta);
      this.amount=Math.min(this.budget.capacity,this.amount+this.budget.recovery*recovering);
    }
  }
  rest(dt:number):void{if(dt<=0||!Number.isFinite(dt))return;this.allows(false);this.update(dt,false);}
}
