function MentionCustomization(editor) {
  // The upcast converter will convert <a class="mention" href="" data-user-id="">
  // elements to the model 'mention' attribute.
  editor.conversion.for('upcast').elementToAttribute({
    view: {
      name: 'span',
      key: 'data-mention',
      classes: 'mention',
      attributes: {
        'data-user-id': true,
        'data-user-name': true,
        'data-user-email': true,
      },
    },
    model: {
      key: 'mention',
      value: viewItem => {
        // The mention feature expects that the mention attribute value
        // in the model is a plain object with a set of additional attributes.
        // In order to create a proper object, use the toMentionAttribute helper method:
        const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
          // Add any other properties that you need.
          uid: viewItem.getAttribute('data-user-id'),
          name: viewItem.getAttribute('data-user-name'),
          email: viewItem.getAttribute('data-user-email'),
        });

        return mentionAttribute;
      },
    },
    converterPriority: 'high',
  });

  // Downcast the model 'mention' text attribute to a view <a> element.
  editor.conversion.for('downcast').attributeToElement({
    model: 'mention',
    view: (modelAttributeValue, { writer }) => {
      // Do not convert empty attributes (lack of value means no mention).
      if (!modelAttributeValue) {
        return;
      }

      return writer.createAttributeElement(
        'span',
        {
          class: 'mention',
          'data-mention': modelAttributeValue.id,
          'data-user-id': modelAttributeValue.uid,
          'data-user-name': modelAttributeValue.name,
          'data-user-email': modelAttributeValue.email,
        },
        {
          // Make mention attribute to be wrapped by other attribute elements.
          priority: 20,
          // Prevent merging mentions together.
          id: modelAttributeValue.uid,
        }
      );
    },
    converterPriority: 'high',
  });
}
export default MentionCustomization;
