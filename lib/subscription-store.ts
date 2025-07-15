class SubscriptionStore {
    private subscriptions: Map<string, PushSubscription> = new Map();

    store(userId: string, subscription: PushSubscription) {
        this.subscriptions.set(userId, subscription);
    }

    get(userId: string): PushSubscription | undefined {
        return this.subscriptions.get(userId);
    }

    remove(userId: string) {
        this.subscriptions.delete(userId);
    }

    getAll(): PushSubscription[] {
        return Array.from(this.subscriptions.values());
    }
}

export const subscriptionStore = new SubscriptionStore();