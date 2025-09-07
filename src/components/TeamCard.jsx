export default function TeamCard({ member }) {
  return (
    <div className="rounded-2xl bg-white shadow-sm p-6 text-center">
      {member.image?.src && (
        <div className="mx-auto h-32 w-32 overflow-hidden rounded-full border">
          <img src={member.image.src} alt={member.image.alt || member.name} className="h-full w-full object-cover" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
      <p className="text-sm text-emerald-700">{member.position}</p>
      <p className="mt-2 text-sm text-gray-600">{member.description}</p>
    </div>
  );
}