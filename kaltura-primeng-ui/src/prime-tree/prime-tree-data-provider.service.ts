import { Injectable } from '@angular/core';
import { PrimeTreeNode } from './prime-tree-node';

export enum NodeChildrenStatuses
{
	missing,
	loading,
	error,
	loaded
}



@Injectable()
export class PrimeTreeDataProvider
{
	constructor()
	{

	}

	create(args : {items : any[], idProperty: string, nameProperty : string, rootParent? : PrimeTreeNode, sortByProperty? : string, parentIdProperty? : string, childrenCountProperty? : string, payload? : any, preventSort? :boolean}) : PrimeTreeNode[] {
		const result: PrimeTreeNode[] = [];
		const rootParent = args.rootParent && typeof args.rootParent !== 'undefined' ? args.rootParent : null; // make sure both 'undefined' and null are handled as 'null'
		const rootParentId = rootParent ? rootParent.data : null;

		if (args.items && args.items.length > 0) {

			// sort items if required
			if (!!args.preventSort === false) {
				args.items.sort((a, b) => {
					let sortField = args.nameProperty;
					let aValue: any, bValue: any;
					if (args.sortByProperty && a[args.sortByProperty] !== b[args.sortByProperty]) {
						sortField = args.sortByProperty;
					}
					if (typeof a[sortField] === 'string') {
						aValue = (a[sortField] || '').toLowerCase();
						bValue = (b[sortField] || '').toLowerCase();
					} else {
						aValue = a[sortField] || 0;
						bValue = b[sortField] || 0;
					}
					return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
				});
			}

			const map: { [key: string]: PrimeTreeNode} = {};
			const childrenNodes: {parentId: any, node: PrimeTreeNode }[] = [];

			args.items.forEach(item => {
				let itemParentId = args.parentIdProperty ? item[args.parentIdProperty] : args.parentIdProperty;
				itemParentId = itemParentId && typeof itemParentId !== 'undefined' ? itemParentId : null; // make sure both 'undefined' and null are handled as 'null'

				let itemChildrenCount = args.childrenCountProperty ? item[args.childrenCountProperty] : null;
				itemChildrenCount = itemChildrenCount && typeof itemChildrenCount !== 'undefined' ? itemChildrenCount : null; // make sure both 'undefined' and null are handled as 'null'
				const itemId = item[args.idProperty];
				const itemName = item[args.nameProperty];

				const node = new PrimeTreeNode(itemId, itemName, itemChildrenCount, item, args.payload);

				if (itemParentId != rootParentId) {
					childrenNodes.push({parentId: itemParentId, node: node});
				} else {
					node.parent = rootParent;

					if (rootParent) {
						if (rootParent.children === null) {
							rootParent.setChildren([]);
						}

						rootParent.children.push(node);
					}

					result.push(node);
				}
				map[itemId] = node;
			});

			childrenNodes.forEach((childrenNodeData) => {
				const parent = map[childrenNodeData.parentId];
				if (parent) {

					childrenNodeData.node.parent = parent;

					if (parent.children === null) {
						parent.setChildren([]);
					}

					parent.children.push(childrenNodeData.node);
				}
			});
		}

		return result;
	}
}
