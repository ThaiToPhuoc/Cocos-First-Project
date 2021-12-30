const { ccclass, property } = cc._decorator;
@ccclass("PoolDescription")
class PoolDescription {


    private initialized: Boolean = false;
    private nodePool: cc.NodePool = null;

    @property(cc.Prefab)
    public prefab: cc.Prefab = null;
    @property(cc.String)
    public name: string = "";
    @property(cc.Integer)
    public count: number = 10;

    public init() {
        this.initialized = false;
        if (!this.prefab) {
            cc.error('[UIPoolManager] Prefab missing!');
            return;
        }
        if (!this.nodePool) {
            this.nodePool = new cc.NodePool(this.name);
        }

        this.nodePool.clear();

        for (let i = 0; i < this.count; i++) {
            let instance = cc.instantiate(this.prefab);
            this.nodePool.put(instance);
        }
        this.initialized = true;
    }

    public get() {
        if (this.initialized) {
            if (this.nodePool.size() > 0) {
                return this.nodePool.get();
            }
        }

        if (this.prefab) return cc.instantiate(this.prefab);
        return null;
    }

    public put(node: cc.Node) {

        if (!node) {
            cc.error('[UIPoolManager] Node missing!');
            return;
        }

        if (this.initialized) {
            this.nodePool.put(node);
            return;
        }
        //if pool not init then destroy current node
        node.destroy();
    }
}

@ccclass
export default class PoolManager extends cc.Component {

    @property([PoolDescription])
    private poolDescriptions: PoolDescription[] = [];

    public static instance: PoolManager = null;
    private static validateInstance() {
        return (!!PoolManager.instance && PoolManager.instance instanceof PoolManager);
    }

    public static getPool(prefabName: string) {
        if (PoolManager.validateInstance()) {
            return PoolManager.instance.get(prefabName);
        }
        return null;
    }

    public static putPool(prefabName: string, prefab: any) {
        if (PoolManager.validateInstance()) {
            return PoolManager.instance.put(prefabName, prefab);
        }
        return null;
    }

    onLoad() {
        if (PoolManager.instance && this !== PoolManager.instance) {
            if (!CC_EDITOR) {
                cc.error("UIDialogManager was initialized!");
            }
            return;
        }
        cc.game.addPersistRootNode(this.node);
        PoolManager.instance = this;
        for (let i = 0; i < this.poolDescriptions.length; i++) {
            const desc = this.poolDescriptions[i];
            if (desc) desc.init();
        }
    }

    public get(poolName: string, prefab: cc.Prefab = null) {
        let pool = this.poolDescriptions.find(p => p.name === poolName);
        if (!pool && prefab) {
            pool = new PoolDescription();
            pool.prefab = prefab;
            pool.count = 10;
            pool.init();
        }

        if (pool) {
            return pool.get();
        }
    }

    public put(poolName: string, node: cc.Node) {
        if (!node) return;
        let pool = this.poolDescriptions.find(p => p.name === poolName);
        if (pool) {
            pool.put(node);
            return;
        }
        node.destroy();
    }
}