import { Subject, Subscriber, Subscription, SubscriptionLike, ObjectUnsubscribedError } from 'rxjs';

const last = <T>( items: T[] ) => items.length > 0 ? items[items.length - 1] : undefined;

export class StackSubject<T> extends Subject<T> {
	private stack: T[] = [];

	/**
	 * DO NOT USE. This is an internal implementation.
	 * 
	 * @param subscriber - The function to execute on new values.
	 */
	public _subscribe( subscriber: Subscriber<T> ): Subscription {
		const subscription = super._subscribe( subscriber );
		if ( subscription && !( subscription as SubscriptionLike ).closed ) {
			this.emitNewValue();
		}
		return subscription;
	  }

	/**
	 * Retrieves the current value of the stack.
	 */
	public get value() {
		if ( this.hasError ) {
			throw this.thrownError;
		} else if ( this.closed ) {
			throw new ObjectUnsubscribedError();
		} else {
			return last( this.stack );
		}
	}
	
	/**
	 * Emit the current value.
	 */
	private emitNewValue() {
		super.next( this.value );
	}

	/**
	 * Append items to the stack.
	 * 
	 * @param items - Items to add at the end of the stack.
	 */
	public push( ...items: T[] ) {
		this.stack.push( ...items );
		this.emitNewValue();
		return this;
	}
}
